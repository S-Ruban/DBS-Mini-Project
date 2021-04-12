import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const makeStore = (preloadedState) => {
	return configureStore({
		reducer: {
			user: userReducer
		},
		preloadedState
	});
};

export default makeStore;
