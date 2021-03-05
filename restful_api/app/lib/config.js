'use strict'

var environments = {};

environments.dev = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'dev',
    'secret': '9)=c7#_0%l45j4l#5f()8(vfufu+o*6w#)ulz(#z=t-6#svi1+',
    'maxChecks': 5
};

environments.tests = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'tests',
    'secret': '9)=c7#_0%l45j4l#5f()8(vfufu+o*6w#)ulz(#z=t-6#svi1+',
    'maxChecks': 5
};

environments.staging = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'staging',
    'secret': 'w7xmp%5jncd1c+c)jig#wyk)mjjw%!#n!#s*=*!@$@t@1l#ter',
    'maxChecks': 5
};

environments.production = {
    'httpPort': 8000,
    'httpsPort': 8001,
    'envName': 'production',
    'secret': 'q8tq%e=k00wwc*du*80z)sg_=1_&+ly=5k)+jdrbi4hia!-4d7',
    'maxChecks': 5
};

var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Defaults to dev environment
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;


module.exports = environmentToExport;