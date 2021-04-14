import { createSlice } from '@reduxjs/toolkit';

export const varSlice = createSlice({
	name: 'var',
	initialState: {
		delAvail: false,
		filters: {
			name: null,
			veg: false,
			cuisines: [],
			mealTypes: []
		}
	},
	reducers: {
		changeDelAvail: (state, action) => {
			state.delAvail = action.payload;
		},
		setFilters: (state, action) => {
			state.filters = action.payload;
		}
	}
});

export const { changeDelAvail, setFilters } = varSlice.actions;
export default varSlice.reducer;
