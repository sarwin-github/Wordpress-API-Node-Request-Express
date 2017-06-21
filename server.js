//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Add the required modules
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express 		= require('express');
const session 		= require('express-session');
const bodyParser 	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const flash 		= require('connect-flash');
const morgan 		= require('morgan');
const passport 		= require('passport');
const http 			= require('http');
const app 			= express();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set database connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const databaseConfig = require('./config/mongo-db-context');
const env = process.env.NODE_EN || 'local';
databaseConfig.pickEnv(env, app);
		
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set view engine and session
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(morgan('dev')); ///morgan is use for development to test what are the request and response that's being handle
app.use(cookieParser());
app.use(flash()); ///flash can be use to store messages or notification on session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); ///Set the view engine to EJS
app.set('views', __dirname + '/views'); ///Set the views directory
app.use(express.static(__dirname));

///Get the bootstrap, jquery, and font-awesome inside the node_module 
app.use('/js'	  , express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js'	  , express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css'	  , express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts/' , express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use('/css/'   , express.static(__dirname + '/node_modules/font-awesome/css'));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set and Initialize Passport
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.login   = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

///Set passport config
//require('./app/professional/config/passport');


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const setRoutes = require('./config/routes-initialization');
setRoutes.initializeRoutes(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Error Handler
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => {
	var err    = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error   = req.app.get('env') === 'development' ? err: {};

	res.status(err.status || 500);
	res.json({error: err, message: res.locals.message});
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Create Server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
http.createServer(app).listen(app.get('port'), () => {
	console.log(`Server Listening to Port: ${app.get('port')}`);
});