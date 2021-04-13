import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Grid,
	Typography
} from '@material-ui/core';
import restaurantImage from '../../images/restaurant.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
		border: true,
		borderWidth: '3px',
		borderColor: '#64eb34',
		borderRadius: 8,
		margin: theme.spacing(2)
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	}
}));

const RestaurantCard = ({ fssai }) => {
	const classes = useStyles();

	const clickHandler = () => {
		console.log(1234);
	};

	return (
		<Card variant='outlined' className={classes.root} onClick={clickHandler}>
			<CardActionArea>
				<CardHeader title='Restaurant Name' />
				<CardMedia
					className={classes.media}
					image={restaurantImage}
					title='Restaurant Image'
				/>
				<CardContent>
					<Grid container justify='space-between' alignItems='center'>
						<Grid item>
							<Typography variant='subtitle2'>Address Line 1</Typography>
							<Typography variant='subtitle2'>Address Line 2</Typography>
							<Typography variant='subtitle2'>City Pincode</Typography>
						</Grid>
						<Grid item>
							<Chip label='Multicuisine' color='secondary' />
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default RestaurantCard;
