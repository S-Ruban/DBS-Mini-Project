import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	FormControlLabel,
	Grid,
	Switch,
	Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ItemImage from '../../images/foodItem.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
		border: true,
		borderWidth: '3px',
		borderRadius: 8,
		borderColor: '#64eb34',
		margin: theme.spacing(2)
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	cardAction: {
		width: '100%',
		justifyContent: 'space-between'
	},
	action: {
		marginRight: theme.spacing(2)
	}
}));

const RestaurantCard = ({ fssai, item_no, type }) => {
	const classes = useStyles();
	const [avail, setAvail] = useState(true);

	const clickHandler = () => {
		console.log('item clicked!');
	};

	const switchHandler = (e) => {
		setAvail(e.target.checked);
	};

	return (
		<Card
			variant='outlined'
			className={classes.root}
			onClick={clickHandler}
			style={{ backgroundColor: type === 'customer' || avail ? 'inherit' : '#d3d3d3' }}
		>
			<CardActionArea>
				<CardHeader title='Item Name' />
				<CardMedia className={classes.media} image={ItemImage} title='Food Item Image' />
				<CardContent>
					<Grid container justify='space-between' alignItems='center'>
						<Grid item>
							<Typography variant='subtitle1'>Item Description</Typography>
						</Grid>
						<Grid item>
							<Chip label='Italian' color='secondary' />
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
			<CardActions className={classes.cardAction}>
				<Typography variant='h4'>&#8377; 69</Typography>
				{type === 'customer' && (
					<Button
						variant='contained'
						color='primary'
						startIcon={<AddIcon />}
						className={classes.action}
					>
						Add to Cart
					</Button>
				)}
				{type === 'restaurant' && (
					<FormControlLabel
						control={
							<Switch checked={avail} onChange={switchHandler} color='primary' />
						}
						label='Availability'
						className={classes.action}
					/>
				)}
			</CardActions>
		</Card>
	);
};

export default RestaurantCard;
