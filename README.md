# pope
[P]ostgres [O]perator [P]rometheus [E]xporter

This is a prometheus exporter for the zalando postgres exporter!

Exports the following metrics:

name: 'pg_operator_cluster_synced',
help: 'Shows timestamp of last successful cluster sync',
labelNames: ['teamAPI', 'clusterName']

name: 'pg_operator_cluster_error',
help: 'Shows cluster error code: 4=all sync retries failed, 3=could not sync cluster, 2=could not connect to db, 1=other errors',
labelNames: ['teamAPI', 'clusterName']

name: 'pg_operator_worker_queue',
help: 'Shows size of worker queue',
labelNames: ['workerID']

name: 'pg_operator_cluster_status_running',
help: 'Shows if the cluster is running (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_creating',
help: 'Shows if the cluster is being created (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_updating',
help: 'Shows if the cluster is being updated (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_updateFailed',
help: 'Shows if the cluster update failed (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_createFailed',
help: 'Shows if the cluster create failed (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_syncFailed',
help: 'Shows if the cluster is not synced (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

name: 'pg_operator_cluster_status_invalid',
help: 'Shows if the cluster status is invalid (1)',
labelNames: ['teamAPI', 'clusterName', 'workerID']

