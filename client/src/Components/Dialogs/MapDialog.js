import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

const MapDialog = ({ open, setCoordinates, onClose }) => {
	const [lat, setLat] = useState('');
	const [long, setLong] = useState('');

	return (
		<Dialog open={open} onClose={() => onClose(false)}>
			<DialogTitle>
				<Typography variant='h6'>Choose your location</Typography>
			</DialogTitle>
			<DialogContent>
				<TextField
					variant='outlined'
					value={lat}
					label='Latitude'
					required
					onChange={(e) => setLat(e.target.value)}
					style={{ marginRight: '10px' }}
				/>
				<TextField
					variant='outlined'
					value={long}
					label='Longitude'
					required
					onChange={(e) => setLong(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					startIcon={<DoneIcon />}
					onClick={() => {
						setCoordinates({ lat, long });
						onClose(false);
					}}
					disabled={lat === '' || long === ''}
				>
					Done
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default MapDialog;
