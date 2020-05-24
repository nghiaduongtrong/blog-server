const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
    if (err) {
        console.log('blog server run error: ' + err);
    }
    console.log('blog server running');
});