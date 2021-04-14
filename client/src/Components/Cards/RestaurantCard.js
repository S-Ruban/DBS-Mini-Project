import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Typography
} from '@material-ui/core';
import Image from 'material-ui-image';
import restaurantImage from '../../Images/restaurant.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		border: true,
		borderWidth: '3px',
		borderRadius: 8,
		flexGrow: 1
	},
	media: {
		height: '10vh'
	}
}));

const RestaurantCard = ({ restaurant }) => {
	const classes = useStyles();

	const clickHandler = () => {
		console.log(1234);
	};

	return (
		<Card
			variant='outlined'
			className={classes.root}
			style={{ borderColor: restaurant.isveg ? '#26d43a' : '#c41f1f' }}
			onClick={clickHandler}
		>
			<CardActionArea>
				<CardHeader title={restaurant.rest_name} titleTypographyProps={{ variant: 'h6' }} />
				<CardMedia>
					<Image
						src={restaurant.img_link ? restaurant.img_link : restaurantImage}
						aspectRatio={3}
					/>
				</CardMedia>
				<CardContent>
					<Grid container justify='space-between' alignItems='center'>
						<Grid item>
							<Typography variant='subtitle2'>{restaurant.aline1}</Typography>
							{restaurant.aline2 && (
								<Typography variant='subtitle2'>{restaurant.aline2}</Typography>
							)}
							<Typography variant='subtitle2'>
								{restaurant.city} - {restaurant.pin}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default RestaurantCard;
