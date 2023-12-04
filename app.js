const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')
const cors = require('cors');

var userRoutes = require('./routes/user')
const empRoutes = require('./routes/emp')
// const { float } = require('webidl-conversions');

const app = express();
var appV1 = express()
app.use(bodyParser.json()) // for parsing application/json

app.use(cors());


// MongoDB Connection
mongoose.connect("mongodb+srv://danieladebayo2004:Akindun123@mydb.2uoqtoa.mongodb.net/comp3123_assignment1", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});



app.get('/index', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });
//Application level middleware
app.use((req, res, next)=>{
    console.log("Application Middleware")
    console.log(`${Date()} - ${req.method} - ${res.path}`)
    next()
})

//Route level middleware
app.use("api/v1/user", (req, res, next)=>{
    console.log("/user/Middleware")
    next()
})

app.use("api/v1/emp", (req, res, next)=>{
    console.log("/emp/Middleware")
    next()
})


appV1.use("/user", userRoutes) // Add this after all middleware and routes have been defined.
appV1.use("/emp", empRoutes)

app.use("/api/v1/", appV1)
 


const PORT = 8089;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
