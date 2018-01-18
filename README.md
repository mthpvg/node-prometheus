# node-prometheus

## Quick start
Start node server:
```bash
npm start
```
Start Prometheus:
```bash
docker run -p 9090:9090 -v /Users/mthpvg/github/mthpvg/node-prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

## Sources
- https://community.tibco.com/wiki/monitoring-your-nodejs-apps-prometheus
