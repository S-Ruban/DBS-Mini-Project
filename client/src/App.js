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
import CartContentCard from './Components/Cards/CartContentCard';
import OrderCard from './Components/Cards/OrderCard';
import ReviewCard from './Components/Cards/ReviewCard';

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
						<Route exact path='/element'>
							<CartContentCard initQuantity={5} />
							<OrderCard />
							<ReviewCard />
						</Route>
					</Switch>
				</Layout>
			</Router>
		</ThemeProvider>
	);
}

export default App;
