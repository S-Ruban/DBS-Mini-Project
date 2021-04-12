import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import { Auth, UnAuth } from './routes';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import CustDashboard from './Dashboards/CustDashboard';
import RestDashboard from './Dashboards/RestDashboard';
import DelDashboard from './Dashboards/DelDashboard';

function App() {
	const user = useSelector((state) => state.user);

	return (
		<Router>
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
			</Switch>
		</Router>
	);
}

export default App;
