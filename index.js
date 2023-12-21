const express = require('express');
const app = express();
const route = require('./routes/routes');

const redisConn = require('./config/redisConnection');

app.use(express.json());
app.use('/',route);

app.listen(4000,async()=>{
    await redisConn.connect();
    console.log(`server started`);
})