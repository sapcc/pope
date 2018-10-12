const fetch   = require('node-fetch');
const MetricsConfig = require('./metricsConfig');


class FetchError extends Error {
    constructor(message, status) {
        super(message);

        this.message = message;
        this.name = this.constructor.name;
        this.status = status || 500;
    }
}

module.exports = class Metrics {
    constructor(operator_url) {
        this.operator_url = operator_url;
        this.clusters = {};
    }

    loadAllMetrics() {
        this.clusters = {};
        return this._getClusters().then(() => {
            return Promise.all([
                this.loadWorkerQueues(),
                this.loadClusterStatus(),
                this.loadClusterSyncAndErrors()
            ]);
        })
    }

    loadWorkerQueues() {
        const url = `${this.operator_url}/workers/all/queue/`;
        return fetchOperatorData(url)
            .then(workers => {
                for (let id in workers) {
                    MetricsConfig.gWorkerQueueSize.labels(id).set(workers[id].List.length);
                }
            })
            .catch(err => {
                console.error("error loadWorkerQueues", err);
        }); 
    }
    
    loadClusterSyncAndErrors() {
        return this._getClusters()
            .then(clusters => {
                let syncPromise = [];
                for (let team in clusters) {
                    clusters[team].forEach(name => {
                        //Team => namespace
                        syncPromise.push(this._getClusterLogs(team, name, team));
                    })
                }
                return Promise.all(syncPromise).then(logs => {
                    this._setClusterSync(logs);
                    this._setClusterErrors(logs);
                });
            })
            .catch(err => {
                console.error("error loadClusterSync", err);
        }); 
    }
    
    loadClusterStatus() {
        return this._getClusters()
            .then(clusters => {
                let statusPromise = [];
                for (let team in clusters) {
                    clusters[team].forEach(name => {
                        //Team => namespace
                        statusPromise.push(this._getClusterStatus(team, name, team));
                    })
                }
                return Promise.all(statusPromise).then(this._setClusterStatus);
            })
            .catch(err => {
                console.error("error loadClusterStatus", err);
            });
    }

    _getClusters() {
        const url = `${this.operator_url}/clusters/`;
        if (Object.keys(this.clusters).length > 0) {
            return Promise.resolve(this.clusters);
        }
        return fetchOperatorData(url)
            .then(clusters =>  {
                this.clusters = clusters;
                return clusters;
            });
    }
    
    _getClusterStatus(team, name, namespace) {
        const url = `${this.operator_url}/clusters/${team}/${namespace}/${name}/`;
        return fetchOperatorData(url)
            .then(json => {
                return {status: json, team: team, name: name}
            });
    }

    _getClusterLogs(team, name, namespace) {
        const url = `${this.operator_url}/clusters/${team}/${namespace}/${name}/logs`;
        return fetchOperatorData(url)
            .then(json => {
                return {status: json, team: team, name: name}
            });
    }

    _setClusterSync(logs) {
        logs.forEach(log => {
            if (log && log.status.length === 0) {
                return
            }
            log.status.forEach(l => {
                if (l.Message === 'cluster has been synced') {
                    MetricsConfig.gClusterSync.labels(log.team, log.name).set(Date.parse(l.Time));
                }
            });
        });
    }

    _setClusterStatus(clusters) {
        clusters.forEach(cluster => {
            for (let status in MetricsConfig.gClusterStatus) {
                if (MetricsConfig.gClusterStatus[cluster.status.Status]) {
                    const gStatus = MetricsConfig.gClusterStatus[cluster.status.Status];
                    gStatus.labels(cluster.team, cluster.name, cluster.status.Worker).set(1);
                }
                MetricsConfig.gClusterStatus[status].labels(cluster.team, cluster.name, cluster.status.Worker).set(0);
            }
        });
    }

    _setClusterErrors(logs) {
        logs.forEach(log => {
            if (log.status && log.status.length === 0) {
                return
            }
 
            log.status.forEach(l => {
                if (l.Level === 2) {
                    const errorCode = this._checkForErrorCodes(l.Message);
                    MetricsConfig.gClusterError.labels(log.team, log.name).set(errorCode);
                }
            });
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

function fetchOperatorData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json());
}

function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw new FetchError(res.statusText, res.status);
    }
}