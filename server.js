const client  = require('prom-client');
const register = client.register;
const express = require('express');
const Metrics = require('./metrics');
const MetricsConfig = require('./metricsConfig');

const server = express();
const PORT = process.env.PORT || 9290;
const HOST = '0.0.0.0';
const OPERATOR_URL = process.env.OPERATOR_URL || "http://postgres-operator-service:8080";

let metrics = new Metrics(OPERATOR_URL);

server.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    try {
        let result = await metrics.loadAllMetrics();
        for (let i in result) {
            await result[i];
        }
        MetricsConfig.gOperatorUp.set(1);
    } catch(err) {
        MetricsConfig.gOperatorUp.set(0);
    }
    res.end(register.metrics());
});

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
