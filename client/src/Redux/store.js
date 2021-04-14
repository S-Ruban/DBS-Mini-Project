import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import varReducer from './varSlice';

const makeStore = (preloadedState) => {
	return configureStore({
		reducer: {
			user: userReducer,
			cart: cartReducer,
			var: varReducer
		},
		preloadedState
	});
};

export default makeStore;
