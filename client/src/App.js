import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import './App.css';
import { Auth, UnAuth } from './routes';
import SignIn from './Components/Auth/SignIn';
import SignUp from './Components/Auth/SignUp';
import CustDashboard from './Components/Dashboards/CustDashboard';
import RestDashboard from './Components/Dashboards/RestDashboard';
import DelDashboard from './Components/Dashboards/DelDashboard';
import Layout from './Components/Layout';
import CustProfile from './Components/Profiles/CustProfile';
import RestProfile from './Components/Profiles/RestProfile';
import DelProfile from './Components/Profiles/DelProfile';
import Cart from './Components/Cart';
import Orders from './Components/Orders';
import Order from './Components/Order';
import Restaurant from './Components/Restaurant';

const theme = createMuiTheme({
	typography: {
		fontFamily: 'Quicksand',
		fontWeightLight: 400,
		fontWeightRegular: 500,
		fontWeightMedium: 600,
		fontWeightBold: 700
	}
});

function App() {
	const user = useSelector((state) => state.user);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Layout>
					<Switch>
						<Route exact path='/'>
							{(user.uname && <Redirect to='/dashboard' />) ||
								(!user.uname && <Redirect to='/signin' />)}
						</Route>
						<UnAuth exact path='/signin'>
							<SignIn />
						</UnAuth>
						<UnAuth exact path='/signup'>
							<SignUp />
						</UnAuth>
						<Auth exact path='/dashboard'>
							{user.type === 'customer' && <CustDashboard />}
							{user.type === 'restaurant' && <RestDashboard />}
							{user.type === 'delivery' && <DelDashboard />}
						</Auth>
						<Auth exact path='/profile'>
							{user.type === 'customer' && <CustProfile />}
							{user.type === 'restaurant' && <RestProfile />}
							{user.type === 'delivery' && <DelProfile />}
						</Auth>
						<Auth exact path='/cart' type='customer'>
							<Cart />
						</Auth>
						<Auth exact path='/orders'>
							<Orders />
						</Auth>
						<Auth path='/orders/:order_no'>
							<Order />
						</Auth>
						<Auth exact path='/restaurants/:fssai' type='customer'>
							<Restaurant />
						</Auth>
						<Route>
							<h1>404 PAGE NOT FOUND</h1>
						</Route>
					</Switch>
				</Layout>
			</Router>
		</ThemeProvider>
	);
}

export default App;
