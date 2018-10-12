const client  = require('prom-client');
const register = client.register;
const express = require('express');
const Metrics = require('./metrics');

const server = express();
const PORT = process.env.PORT || 9290;
const HOST = '0.0.0.0';
const OPERATOR_URL = process.env.OPERATOR_URL || "http://ipmi-exporter:8080";

let metrics = new Metrics(OPERATOR_URL);

server.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType);
    metrics.loadAllMetrics()
    .then(g => {
        res.end(register.metrics());
    })
    .catch(e => {
        res.status(500).end();
    });
});

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);