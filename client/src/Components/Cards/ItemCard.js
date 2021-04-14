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
import Image from 'material-ui-image';
import AddIcon from '@material-ui/icons/Add';
import ItemImage from '../../Images/foodItem.jpg';

const useStyles = makeStyles((theme) => ({
	root: {
		border: true,
		borderWidth: '3px',
		borderRadius: 8,
		margin: theme.spacing(2),
		flexGrow: 1
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
	},
	chip: {
		marginRight: theme.spacing(1)
	}
}));

const RestaurantCard = ({ item, type }) => {
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
			style={{
				backgroundColor: type === 'customer' || avail ? 'inherit' : '#d3d3d3',
				borderColor: item.isveg ? '#26d43a' : '#c41f1f'
			}}
		>
			<CardActionArea>
				<CardHeader title={item.itemname} titleTypographyProps={{ variant: 'h6' }} />
				<CardMedia>
					<Image src={item.img_link ? item.img_link : ItemImage} aspectRatio={3} />
				</CardMedia>
				<CardContent>
					<Grid container alignItems='center' spacing={2}>
						<Grid item xs={12}>
							<Typography variant='subtitle1'>
								{item.itemdesc ? item.itemdesc : 'No description available'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Chip label={item.cuisine} color='secondary' />
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
			<CardActions className={classes.cardAction}>
				<Typography variant='h4'>&#8377; {item.price}</Typography>
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
