import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

const DelDashboard = () => {
	const delAvail = useSelector((state) => state.var.delAvail);

	return (
		<Grid container justify='center' alignItems='center' style={{ minHeight: '100vh' }}>
			<Grid item>
				{delAvail && <Typography variant='h3'>Waiting for Orders ...</Typography>}
				{!delAvail && <Typography variant='h3'>You are not accepting orders</Typography>}
			</Grid>
		</Grid>
	);
};

export default DelDashboard;
