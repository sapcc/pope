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
	labelNames: ['teamAPI']
});

const gClusterStatusRunning = new Gauge({
	name: 'pg_operator_cluster_status_running',
	help: 'Shows if the cluster is running (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusCreating = new Gauge({
	name: 'pg_operator_cluster_status_creating',
	help: 'Shows if the cluster is being created (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusUpdating = new Gauge({
	name: 'pg_operator_cluster_status_updating',
	help: 'Shows if the cluster is being updated (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusUpdateFailed = new Gauge({
	name: 'pg_operator_cluster_status_updateFailed',
	help: 'Shows if the cluster update failed (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusCreateFailed = new Gauge({
	name: 'pg_operator_cluster_status_createFailed',
	help: 'Shows if the cluster create failed (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusSyncFailed = new Gauge({
	name: 'pg_operator_cluster_status_syncFailed',
	help: 'Shows if the cluster is not synced (1)',
	labelNames: ['teamAPI', 'clusterName']
});
const gClusterStatusInvalid = new Gauge({
	name: 'pg_operator_cluster_status_invalid',
	help: 'Shows if the cluster status is invalid (1)',
	labelNames: ['teamAPI', 'clusterName']
});

clusterStatus = {
    "Running"      : gClusterStatusRunning,
    "Creating"     : gClusterStatusCreating,
    "Updating"     : gClusterStatusUpdating,
    "UpdateFailed" : gClusterStatusUpdateFailed,
    "CreateFailed" : gClusterStatusCreateFailed,
    "SyncFailed"   : gClusterStatusSyncFailed,
    "Invalid"      : gClusterStatusInvalid
}

module.exports = {
	gClusterCount: gClusterCount,
    gClusterStatus: clusterStatus,
    gClusterSync: gClusterSync,
    gClusterError: gClusterError,
    gWorkerQueueSize: gWorkerQueueSize
}