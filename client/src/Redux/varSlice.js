import { createSlice } from '@reduxjs/toolkit';

export const varSlice = createSlice({
	name: 'var',
	initialState: {
		delAvail: false
	},
	reducers: {
		changeDelAvail: (state, action) => {
			state.delAvail = action.payload;
		}
	}
});

export const { changeDelAvail } = varSlice.actions;
export default varSlice.reducer;
