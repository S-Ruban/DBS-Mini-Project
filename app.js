require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const pool = require('./Models/dbConfig');
const { auth, unauth, authCustomer } = require('./auth');
const { newWorkerUtils, newRunner } = require('./jobHelpers');
const signup = require('./Routes/signup');
const signin = require('./Routes/signin');
const profile = require('./Routes/profile');
const orders = require('./Routes/orders');
const items = require('./Routes/items');
const restaurants = require('./Routes/restaurants');
const cart = require('./Routes/cart');
const ratings = require('./Routes/ratings');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.listen(process.env.SERVER_PORT, () => {
	console.log(`Listening on port ${process.env.SERVER_PORT}`);
});

const sessionConfig = {
	store: new PgSession({
		pool,
		tableName: 'user_sessions'
	}),
	secret: process.env.SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: process.env.MODE !== 'development',
		httpOnly: true
	},
	resave: false,
	saveUninitialized: true
};

app.use(express.json());
app.use(session(sessionConfig));
app.use(async (req, res, next) => {
	app.set('workerUtils', await newWorkerUtils());
	app.set('runner', await newRunner());
	next();
});

app.get('/', (req, res) => {
	if (req.session && req.session.user) res.redirect('/dashboard');
	else res.redirect('/signin');
});

app.get('/dashboard', auth, (req, res) => {
	try {
		res.send({
			message: `Welcome to Dashboard ${req.session.user.uname}!`
		});
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

app.use('/signin', unauth, signin);
app.use('/signup', unauth, signup);
app.use('/profile', auth, profile);
app.use('/orders', authCustomer, orders);
app.use('/items', auth, items);
app.use('/restaurants', authCustomer, restaurants);
app.use('/cart', authCustomer, cart);
app.use('/ratings', auth, ratings);

app.get('/signout', auth, (req, res) => {
	req.session.destroy();
	res.send({ message: 'Signed Out!' });
});

app.use((req, res) => {
	res.status(404).send({ message: 'Page not found' });
});
