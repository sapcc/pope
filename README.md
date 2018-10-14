# pope
[P]ostgres [O]perator [P]rometheus [E]xporter

This is a prometheus exporter for the zalando [postgres operator](https://github.com/sapcc/postgres-operator)!

It shows the status of deployed postgres clusters.

Exports the following metrics:

| Name          | Help          | labels    |
| ------------- | ------------- | --------- |
| pg_operator_cluster_synced  | Shows timestamp of last successful cluster sync | ['teamAPI', 'clusterName']
| pg_operator_cluster_error  | Shows cluster error code: 4=all sync retries failed, 3=could not sync cluster, 2=could not connect to db, 1=other errors  | ['teamAPI', 'clusterName']
| pg_operator_worker_queue | Shows size of worker queue |['workerID']
| pg_operator_cluster_count | Shows the current number of clusters | ['name']
| pg_operator_cluster_status_running | Shows if the cluster is running (1) | ['teamAPI', 'clusterName'] 
| pg_operator_cluster_status_creating | Shows if the cluster is being created (1) | ['teamAPI', 'clusterName']
| pg_operator_cluster_status_updating | Shows if the cluster is being updated (1) | ['teamAPI', 'clusterName']
| pg_operator_cluster_status_updateFailed | Shows if the cluster update failed (1) | ['teamAPI', 'clusterName']
| pg_operator_cluster_status_createFailed | Shows if the cluster create failed (1) | ['teamAPI', 'clusterName']
| pg_operator_cluster_status_syncFailed | Shows if the cluster is not synced (1) | ['teamAPI', 'clusterName']
| pg_operator_cluster_status_invalid | Shows if the cluster status is invalid (1) |  ['teamAPI', 'clusterName']

