const fetch   = require('node-fetch');
const MetricsConfig = require('./metricsConfig');

//TODO: ,"Message":"performing rolling update"}
//TODO: is not in the desired state and needs to be updated"
//TODO: worker logs: "Message":"deletion of the cluster started" / Message":"\"DELETE\" event has been queued"

class FetchError extends Error {
    constructor(message, status) {
        super(message);

        this.message = message;
        this.name = this.constructor.name;
        this.status = status || 500;
    }
}

class NoClusterError extends Error {
    constructor(message, team, cluster) {
        super(message);

        this.message = message;
        this.team = team;
        this.cluster = cluster;
        this.name = this.constructor.name;
    }
}

module.exports = class Metrics {
    constructor(operator_url) {
        this.operator_url = operator_url;
        this.clusters = {};
    }

    async loadAllMetrics() {
        this.clusters = {};
        try {
            await this._getClusters();
            return [
                this.loadWorkerQueues(),
                this.loadClusterStatus(),
                this.loadClusterSyncAndErrors()
            ]
        } catch(err) {
            if (err instanceof NoClusterError) {
                return [
                    this._setClusterCount(),
                    this.loadWorkerQueues()
                ]
            }
            console.log(err);
            throw err;
        }
    }

    async loadWorkerQueues() {
        const url = `${this.operator_url}/workers/all/queue/`;
        try {
            let workers = await fetchOperatorData(url);
            for (let id in workers) {
                MetricsConfig.gWorkerQueueSize.labels(id).set(workers[id].List.length);
            }
        } catch(err) {
            console.error("error loadWorkerQueues", err);
        }
    }
    
    async loadClusterSyncAndErrors() {
        try {
            let clusters = await this._getClusters();
            let syncPromise = [];
            for (let team in clusters) {
                clusters[team].forEach(name => {
                    //Team => namespace
                    syncPromise.push(this._getClusterLogs(team, name, team));
                })
            }
            for (let p in syncPromise) {
                try {
                    this._setClusterSync(await syncPromise[p]);
                    this._setClusterErrors(await syncPromise[p]);
                } catch(err) {
                    console.error("error loadClusterSync", err)
                }
            }
        } catch(err) {
            console.error("error loadClusterSync", err);
        }
    }
    
    async loadClusterStatus() {
        try {
            this._setClusterCount();
            MetricsConfig.gClusterStatus.reset();
            let clusters = await this._getClusters();
            let statusPromise = [];
            for (let team in clusters) {
                clusters[team].forEach(name => {
                    //Team => namespace
                    statusPromise.push(this._getClusterStatus(team, name, team));
                })
            }
            for (let p in statusPromise) {
                try {
                    this._setClusterStatus(await statusPromise[p]);
                } catch(err) {
                    if (err instanceof NoClusterError) {
                        this._setClusterStatus({status: {Status: "Invalid"}, team: err.team, name: err.cluster});
                    }
                    console.error("error loadClusterStatus", err)
                }
            }
        } catch(err) {
            console.error("error loadClusterStatus", err);
        }
    }

    async _getClusters() {
        const url = `${this.operator_url}/clusters/`;
        if (Object.keys(this.clusters).length > 0) {
            return Promise.resolve(this.clusters);
        }
        let clusters = await fetchOperatorData(url);
        if (Object.keys(clusters).length === 0) {
            throw new NoClusterError();
        }
        this.clusters = clusters;
        return clusters;
    }
    
    async _getClusterStatus(team, name, namespace) {
        const url = `${this.operator_url}/clusters/${team}/${namespace}/${name}/`;
        let json = await fetchOperatorData(url, team, name);
        return {status: json, team: team, name: name}
    }

    async _getClusterLogs(team, name, namespace) {
        const url = `${this.operator_url}/clusters/${team}/${namespace}/${name}/logs`;
        let json = await fetchOperatorData(url, team, name);
        return {status: json, team: team, name: name}
    }

    _setClusterCount() {
        let count = 0;
        for (let team in this.clusters) {
            count = count + this.clusters[team].length;
            MetricsConfig.gClusterCount.labels(team).set(this.clusters[team].length);
        }
        MetricsConfig.gClusterCount.labels("total").set(count)
    }

    _setClusterSync(log) {
        if (!log || !log.status || log.status.length === 0) {
            return
        }
        log.status.forEach(l => {
            if (l.Message === 'cluster has been synced') {
                MetricsConfig.gClusterSync.labels(log.team, log.name).set(Date.parse(l.Time));
            }
        });
    }

    _setClusterStatus(cluster) {
        MetricsConfig.clusterStatus.forEach(status => {
            if (status === cluster.status.Status) {
                MetricsConfig.gClusterStatus.labels(cluster.team, cluster.name, status).set(1);
            }
        });
    }

    _setClusterErrors(log) {
        if (!log || !log.status || log.status.length === 0) {
            return
        }
        log.status.forEach(l => {
            if (l.Level === 2) {
                const errorCode = this._checkForErrorCodes(l.Message);
                MetricsConfig.gClusterError.labels(log.team, log.name).set(errorCode);
            }
        });
    }

    _checkForErrorCodes(errors) {
        if (errors.includes("still failing after 8 retries")) {
            return 4;
        }
        if (errors.includes("could not sync cluster")) {
            return 3;
        }
        if (errors.includes("could not connect to PostgreSQL database")) {
            return 2;
        }
        return 1;
    }
}

async function fetchOperatorData(url, team, cluster) {
    let res = await fetch(url);
    await checkStatus(res, team, cluster);
    return res.json();
}

async function checkStatus(res, team, cluster) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        let err = await res.json();
        if (err.error === "could not find cluster") {
            throw new NoClusterError(res.statusText, team, cluster);
        }
        throw new FetchError(res.statusText, res.status);
    }
}