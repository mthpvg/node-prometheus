const express = require('express');
const Register = require('prom-client').register;
const Counter = require('prom-client').Counter;
const Summary = require('prom-client').Summary;
const ResponseTime = require('response-time');
const app = express();

const numOfRequests = new Counter({
  name: 'numOfRequests',
  help: 'Number of requests made',
  labelNames: ['method']
});

const pathsTaken = new Counter({
  name: 'pathsTaken',
  help: 'Paths taken in the app',
  labelNames: ['path']
});

const responses = new Summary({
  name: 'responses',
  help: 'Response time in millis',
  labelNames: ['method', 'path', 'status']
});

const startCollection = function () {
  console.log(`Starting the collection of metrics, the metrics are available on /metrics`);
  require('prom-client').collectDefaultMetrics();
};

const requestCounters = function (req, res, next) {
  if (req.path != '/metrics') {
    numOfRequests.inc({ method: req.method });
    pathsTaken.inc({ path: req.path });
  }
  next();
};

const responseCounters = ResponseTime(function (req, res, time) {
  if(req.url != '/metrics') {
    responses.labels(req.method, req.url, res.statusCode).observe(time);
  }
})

app.use(requestCounters);
app.use(responseCounters);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Register.contentType);
  res.end(Register.metrics());
});

startCollection();

app.listen(3000, () => console.log('Example app listening on port 3000!'));
