const client = require('../databases/init.redis')
const { promisify } = require("util")

const REDIS_GET = promisify(client.get).bind(client);
const REDIS_SET = promisify(client.set).bind(client);
const REDIS_LRANGE = promisify(client.lrange).bind(client);
const REDIS_DEL = promisify(client.del).bind(client);
const REDIS_FLUSHDB = promisify(client.flushdb).bind(client);


module.exports = {
    REDIS_GET,
    REDIS_SET,
    REDIS_LRANGE,
    REDIS_DEL,
    REDIS_FLUSHDB
}