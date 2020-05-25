const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const api = require('./api');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use('/api', api);

const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
    if (err) {
        console.log('blog server run error: ' + err);
    }
    console.log('blog server is up and listening on port ' +  PORT);
});