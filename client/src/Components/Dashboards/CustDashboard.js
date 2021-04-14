import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import RestaurantCard from '../Cards/RestaurantCard';
import ItemCard from '../Cards/ItemCard';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
	item: {
		margin: theme.spacing(2)
	}
}));

const CustDashboard = () => {
	const classes = useStyles();
	const [restaurants, setRestaurants] = useState([]);
	const [items, setItems] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let res = await axios.get('/restaurants');
				setRestaurants(res.data);
				res = await axios.get('/items');
				setItems(res.data);
			} catch (err) {
				console.log(err.response.data.message);
			}
		};
		fetchData();
	}, []);

	return (
		<Grid container direction='column' justify='flex-start'>
			<Grid item className={classes.item}>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant='h4'>Restaurants</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2} alignItems='stretch'>
							{restaurants.map((restaurant) => (
								<Grid
									item
									key={restaurant.fssai}
									xs={3}
									style={{ display: 'flex' }}
								>
									<RestaurantCard restaurant={restaurant} />
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Grid>
			<Grid item className={classes.item}>
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant='h4'>Items</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2} alignItems='stretch'>
							{items.map((item) => (
								<Grid
									item
									key={`${item.fssai} ${item.itemno}`}
									xs={3}
									style={{ display: 'flex' }}
								>
									<ItemCard item={item} type='customer' />
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Grid>
		</Grid>
	);
};

export default CustDashboard;
