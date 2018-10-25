const client  = require('prom-client');
const Gauge = client.Gauge;


const gOperatorUp = new Gauge({
	name: 'pg_operator_up',
	help: 'Shows if operator is up',
	labelNames: []
});

const gClusterSync = new Gauge({
	name: 'pg_operator_cluster_synced',
	help: 'Shows timestamp of last successful cluster sync',
	labelNames: ['teamAPI', 'clusterName']
});

const gClusterError = new Gauge({
	name: 'pg_operator_cluster_error',
	help: 'Shows cluster error code: 4=all sync retries failed, 3=could not sync cluster, 2=could not connect to db, 1=other errors',
	labelNames: ['teamAPI', 'clusterName']
});

const gWorkerQueueSize = new Gauge({
	name: 'pg_operator_worker_queue',
	help: 'Shows size of worker queue',
	labelNames: ['workerID']
});

const gClusterCount = new Gauge({
	name: 'pg_operator_cluster_count',
	help: 'Shows the current number of clusters',
	labelNames: ['name']
});

const gClusterStatus = new Gauge({
	name: 'pg_operator_cluster_status',
	help: 'Shows if the cluster is running (1)',
	labelNames: ['teamAPI', 'clusterName', 'status', 'buckedID']
});

clusterStatus = {
    "Running": 0,
    "Creating": 1,
    "Updating": 2,
    "UpdateFailed": 3,
    "CreateFailed": 4,
    "SyncFailed": 5,
    "Invalid": 6
}

module.exports = {
	gOperatorUp: gOperatorUp,
	gClusterStatus: gClusterStatus,
	clusterStatus: clusterStatus,
	gClusterCount: gClusterCount,
    gClusterSync: gClusterSync,
    gClusterError: gClusterError,
    gWorkerQueueSize: gWorkerQueueSize
}