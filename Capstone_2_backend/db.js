"use strict";
/** Database setup for tripcards. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const client = new Client({
                    connectionString: getDatabaseUri()
});

client.connect();

module.exports = client;