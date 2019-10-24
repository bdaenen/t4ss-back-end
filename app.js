require('./db/index');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fileUpload = require('express-fileupload');

let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);

let app = express();

// Middleware
app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

let sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 900000,
    // 30 days
    expiration: 60*60*24*30*1000,
    createDatabaseTable: true,
    endConnectionOnClose: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

// Sessions
app.use(session({
    secret: "ZSg4s6fZvfeKJ789HIO7erF",
    resave: false,
    store: sessionStore,
    name: 't4ssbackend',
    saveUninitialized: false,
    cookie : {
        maxAge: 60*60*48*1000,
        secure: parseInt(process.env.IS_HTTPS),
        httpOnly: true,
        domain: process.env.DOMAIN
    }
}));

// Set CORS headers
app.use(async function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Always approve preflight CORS requests.
app.options("/*", function(req, res, next){
  res.sendStatus(200);
});

app.use('/cats', require('./routes/cats'));
app.use('/catteries', require('./routes/catteries'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendStatus(404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  // render the error page
  res.sendStatus(err.status || 500);
});


module.exports = app;
