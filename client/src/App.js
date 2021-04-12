import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import UserContext from './UserContext';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import CustDashboard from './Dashboards/CustDashboard';
import RestDashboard from './Dashboards/RestDashboard';
import DelDashboard from './Dashboards/DelDashboard';

function App() {
	const [user, setUser] = useState({ uname: null, type: null });

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Router>
				<Switch>
					<Route exact path='/'>
						<Redirect to='/signin' />
					</Route>
					<Route exact path='/signin'>
						<SignIn />
					</Route>
					<Route exact path='/signup'>
						<SignUp />
					</Route>
					<Route exact path='/dashboard'>
						{user.type === 'customer' && <CustDashboard />}
						{user.type === 'restaurant' && <RestDashboard />}
						{user.type === 'delivery' && <DelDashboard />}
					</Route>
				</Switch>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
