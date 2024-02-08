const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
// const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
// const MongoStore = require('connect-mongo');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klein';
const MAX_QUERY_LIMIT = 1e3;
const QUERY_LIMIT = 20;

const loginRouteController = require('./routes/loginRoute.js');
const homeRouteController = require('./routes/homeRoute.js');
const nodeRouteController = require('./routes/nodeRoute.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongoose.set('strictQuery', false);
// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({
  //   mongoUrl: MONGODB_URI
  // })
});

app.use(cookieParser());
app.use(sessionOptions);

app.use((req, res, next) => {
  if (!req.query || typeof req.query != 'object')
    req.query = {};
  if (!req.body || typeof req.body != 'object')
    req.body = {};

  if (!req.query.limit || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 1 || parseInt(req.query.limit) > MAX_QUERY_LIMIT) {
    res.locals.QUERY_LIMIT = QUERY_LIMIT;
    req.query.limit = QUERY_LIMIT;
  } else {
    res.locals.QUERY_LIMIT = parseInt(req.query.limit);
    req.query.limit = parseInt(req.query.limit);
  };

  next();
});

app.get('/', (req, res) => {
  return res.redirect('/login');
});
app.use('/login', loginRouteController);
app.use('/home', homeRouteController);
app.use('/node', nodeRouteController);

server.listen(PORT, () => {
  console.log(`Server is on port ${PORT} and is running.`);
});

module.exports = app;