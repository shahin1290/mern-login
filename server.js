const express = require('express')
const connectDB = require('./config/db') 
const app = express();

connectDB()
app.use(express.json({ extended: false }))


app.get('/', function(req, res) {
    res.send('API running');
});


app.use('/api/users', require('./routes/api/users'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});