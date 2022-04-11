// if we are running ts-node or jest, go after ts files, if not, go after compiled js files in lib folder
const runningInTypescript = /(ts-node|jest)$/.test(process.env._) || process.env.TS_JEST === '1';

/*
here is where ssl settings are setup.
you can find out more about what can be set here at https://node-postgres.com/features/ssl
NOTE: until we mount the ca from rds, we are going to allow unauthorized connection (https://github.com/revolutionmortgage/credit-plus/issues/78)
*/
let ssl = false;
if (process.env.DB_SSL) {
    ssl = {
        rejectUnauthorized: false,
    }
}

module.exports = {
    "type": "postgres",
    "host": process.env.POSTGRES_HOST ?? "localhost",
    "port": 5432,
    "username": process.env.POSTGRES_USERNAME ?? "temporal",
    "password": process.env.POSTGRES_PASSWORD ?? "temporal",
    "database": "creditplus",
    "logging": true,
    ssl,
    "entities": [
        runningInTypescript
            ? "src/data/entities/**/*.ts"
            : "lib/src/data/entities/**/*.js"
    ],
    "migrations": [
        runningInTypescript
            ? "src/data/migrations/**/*.ts"
            : "lib/src/data/migrations/**/*.js"
    ],
    "cli": {
        "migrationsDir": runningInTypescript
            ? "src/data/migrations"
            : "lib/src/data/migrations"
    }
}