import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import OrderHistoryTable from './Tables/OrderHistoryTable';

const Orders = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				try {
					const res = await axios.get('/orders');
					setOrders(res.data);
				} catch (err) {
					console.log(err.response.data.message);
				}
			} catch (err) {}
		};
		fetchData();
	}, []);

	return (
		<Grid
			container
			direction='column'
			justify='center'
			alignItems='center'
			spacing={4}
			style={{ marginTop: 2 }}
		>
			<Grid item>
				<Typography variant='h3' style={{ fontWeight: 500 }}>
					ORDER HISTORY
				</Typography>
			</Grid>
			<Grid item>
				<OrderHistoryTable orders={orders} />
			</Grid>
		</Grid>
	);
};

export default Orders;
