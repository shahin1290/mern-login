const express = require('express')
const connectDB = require('./config/db') 
const app = express();

connectDB()


app.get('/', function(req, res) {
    res.send('hello');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});