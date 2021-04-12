import React from 'react';

const UserContext = React.createContext({
	user: { uname: null, type: null },
	setUser: (user) => {}
});

export default UserContext;
