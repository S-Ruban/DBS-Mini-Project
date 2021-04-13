import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const makeStore = (preloadedState) => {
	return configureStore({
		reducer: {
			user: userReducer,
			cart: cartReducer
		},
		preloadedState
	});
};

export default makeStore;
