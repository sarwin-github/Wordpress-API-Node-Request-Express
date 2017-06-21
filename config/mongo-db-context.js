const session 	 = require('express-session');
const mongoose 	 = require('mongoose');
const mongoStore = require('connect-mongo')(session);

//Local connection
//{auth:{authdb:"admin"}},
let mongoConnectionLocal = {	
	'url': 'mongodb://sarwin:01610715@localhost:27017/wordpress-api'
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	mongoose.Promise = global.Promise;
	switch (env) {
	    case 'local':
	    	app.set('port', process.env.PORT || 9090);
	        mongoose.connect(mongoConnectionLocal.url, {auth:{authdb:"admin"}},  err => { if(err) { console.log(err); }});
			break;
	};
	
	///Set session and cookie max life, store session in mongo database
	app.use(session({
		secret: "53BBCA1D5814C7342D9725AF82178",    
		resave: true,
	  	saveUninitialized: false, 
		store: new mongoStore({ mongooseConnection: mongoose.connection }),
		cookie: { maxAge: 60 * 60 * 1000 }
	}));
};
