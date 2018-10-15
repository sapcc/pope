const client  = require('prom-client');
const Gauge = client.Gauge;



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
	labelNames: ['teamAPI', 'clusterName', 'status']
});

clusterStatus = [
    "Running",
    "Creating",
    "Updating",
    "UpdateFailed",
    "CreateFailed",
    "SyncFailed",
    "Invalid"
]

module.exports = {
	gClusterStatus: gClusterStatus,
	clusterStatus: clusterStatus,
	gClusterCount: gClusterCount,
    gClusterSync: gClusterSync,
    gClusterError: gClusterError,
    gWorkerQueueSize: gWorkerQueueSize
}