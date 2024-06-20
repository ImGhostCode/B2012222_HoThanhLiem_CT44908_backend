const { createClient } = require('redis');
const client = createClient({
    url: process.env.REDIS_URL
});

client.ping(function (err, result) {
    console.log(result);
})

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", (error) => {
    console.error(error);
});

client.flushdb(function (err, succeeded) {
    if (err) {
        console.error('Error clearing database:', err);
    } else {
        console.log('Database cleared:', succeeded);
    }

    // Close the connection
    // client.quit();
});


module.exports = client