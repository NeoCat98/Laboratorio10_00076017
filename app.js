var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Para el manejo de sesiones.
const session = require('express-session');
//Almacenar la sesion en nuestra base de datos
const MongoStore = require('connect-mongo')(session);
//Credenciales de nuestra base de datos
const {mongodb}=require('./configs/keys');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
/*Conexion con mongodb*/
require('./configs/database');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
    secret:"Hello World!!!",
    resave: true, // para alamcenar el objeto session
    saveUninitialized: true, // inicializar si el objeto esta vacio
    //para almacenar la sesion en la base de datos
    store: new MongoStore({
        url: mongodb.URI,
        autoReconnect: true
    })
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    app.locals.session = req.session;
    next();
    });


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
