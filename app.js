var createError = require('http-errors');
var express = require('express');
var path = require('path');

const bcrypt = require('bcryptjs');

var indexRouter = require('./routes/index');

const connectDB = require('./Configs/db');
const PORT = process.env.PORT || 3000
var app = express();
connectDB()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.listen(PORT, (req, res) => {
  console.log(`http://localhost:${PORT}`);
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


module.exports = app;
