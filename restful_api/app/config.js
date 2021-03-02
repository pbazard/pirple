

var environments = {};

environments.dev = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'dev'
};

environments.tests = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'dev'
};

environments.staging = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'dev'
};

environments.production = {
    'httpPort': 8000,
    'httpsPort': 8001,
    'envName': 'dev'
};

var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Defaults to dev environment
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;


module.exports = environmentToExport;