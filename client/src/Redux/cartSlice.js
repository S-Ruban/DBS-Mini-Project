import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
	name: 'cart',
	initialState: {
		count: 0
	},
	reducers: {
		addItem: (state) => {
			state.count += 1;
		},
		removeItem: (state) => {
			state.count -= 1;
		}
	}
});

export const { addItem, removeItem } = userSlice.actions;
export default userSlice.reducer;
