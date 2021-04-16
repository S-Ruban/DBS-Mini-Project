import React, { useState } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Button,
	TextField,
	Grid,
	FormControlLabel,
	Checkbox,
	Select,
	FormControl,
	InputLabel,
	MenuItem
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import { cuisineData, mealTypeData } from '../../data';

const CreateItemDialog = ({ open, onClose, handleSave }) => {
	const [itemname, setItemname] = useState('');
	const [img_link, setImg_link] = useState('');
	const [itemdesc, setItemdesc] = useState('');
	const [isavail, setIsavail] = useState(true);
	const [isveg, setIsveg] = useState(false);
	const [cuisine, setCuisine] = useState(cuisineData[0]);
	const [mealtype, setMealtype] = useState(mealTypeData[0]);
	const [price, setPrice] = useState(0);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>
				<Typography variant='h6'>Create Item</Typography>
			</DialogTitle>
			<DialogContent style={{ overflow: 'hidden' }}>
				<Grid
					container
					direction='column'
					justify='center'
					alignItems='stretch'
					spacing={2}
				>
					<Grid item>
						<TextField
							variant='outlined'
							label='Item Name'
							fullWidth
							required
							onChange={(e) => setItemname(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<TextField
							variant='outlined'
							label='Item description'
							fullWidth
							multiline
							rows={4}
							onChange={(e) => setItemdesc(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<TextField
							variant='outlined'
							label='Image Link'
							fullWidth
							onChange={(e) => setImg_link(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<Grid container justify='center' spacing={6}>
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											checked={isveg}
											onChange={(e) => setIsveg(e.target.checked)}
											color='primary'
										/>
									}
									label='Veg'
								/>
							</Grid>
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											checked={isavail}
											onChange={(e) => setIsavail(e.target.checked)}
											color='primary'
										/>
									}
									label='Available'
								/>
							</Grid>
							<Grid item>
								<TextField
									variant='outlined'
									label='Price'
									fullWidth
									onChange={(e) => setPrice(e.target.value)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid container justify='center' alignItems='stretch' spacing={4}>
							<Grid item>
								<FormControl variant='outlined' style={{ minWidth: '15vw' }}>
									<InputLabel id='cuisine'>Cuisine</InputLabel>
									<Select
										labelId='cuisine'
										value={cuisine}
										onChange={(e) => setCuisine(e.target.value)}
										label='Cuisine'
										fullWidth
									>
										{cuisineData.map((cuis) => (
											<MenuItem key={cuis} value={cuis}>
												{cuis}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item>
								<FormControl variant='outlined' style={{ minWidth: '15vw' }}>
									<InputLabel id='mealtype'>Meal Type</InputLabel>
									<Select
										labelId='mealtype'
										value={mealtype}
										onChange={(e) => setMealtype(e.target.value)}
										label='Meal Type'
										fullWidth
									>
										{mealTypeData.map((mt) => (
											<MenuItem key={mt} value={mt}>
												{mt}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					startIcon={<CloseIcon />}
					onClick={onClose}
					color='primary'
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					startIcon={<SaveIcon />}
					onClick={() => {
						const item = {
							itemname,
							img_link,
							itemdesc,
							isavail,
							isveg,
							cuisine,
							mealtype,
							price
						};
						handleSave(item);
					}}
					color='primary'
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateItemDialog;
