import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
	const filters = useSelector((state) => state.var.filters);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let res = await axios.get('/restaurants', {
					params: filters
				});
				setRestaurants(res.data);
				res = await axios.get('/items', {
					params: filters
				});
				setItems(res.data);
			} catch (err) {
				console.log(err.response.data.message);
			}
		};
		fetchData();
	}, [filters]);

	return (
		<Grid container justify='center'>
			<Grid item className={classes.item} xs={12}>
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
			<Grid item className={classes.item} xs={12}>
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
