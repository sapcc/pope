# pope
[P]ostgres [O]perator [P]rometheus [E]xporter

This is a prometheus exporter for the zalando postgres operator!

It shows the status of deployed postgres clusters.

Exports the following metrics:

| Name          | Help          | labels    |
| ------------- | ------------- | --------- |
| pg_operator_cluster_synced  | Shows timestamp of last successful cluster sync | ['teamAPI', 'clusterName']
| pg_operator_cluster_error  | Shows cluster error code: 4=all sync retries failed, 3=could not sync cluster, 2=could not connect to db, 1=other errors  | ['teamAPI', 'clusterName']
| pg_operator_worker_queue | Shows size of worker queue |['workerID']
] pg_operator_cluster_count | Shows the current number of clusters | ['name']
| pg_operator_cluster_status | Shows the status of the cluster) | ['teamAPI', 'clusterName', 'status']

