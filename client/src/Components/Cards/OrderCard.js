import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, IconButton, Link, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(2)
	},
	link: {
		color: 'inherit',
		'&:hover': {
			textDecoration: 'none'
		}
	},
	quant: {
		width: '20%'
	}
	//BGColor to be added for different tye of orders
}));

const CartContentCard = () => {
	const classes = useStyles();

	const clickHandler = () => {
		console.log(1234);
	};

	return (
		<Card className={classes.root}>
			<CardContent>
				<Grid container justify='space-evenly' alignItems='center'>
					<Grid item>
						<ShoppingCartIcon fontSize='large' />
					</Grid>
					<Grid item>
						<Typography variant='h6' onClick={clickHandler} style={{ width: '10em' }}>
							<Link href='#' onClick={clickHandler} className={classes.link}>
								Order Number
							</Link>
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant='h6' style={{ width: '10em' }}>
							{5} Items
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant='h6' style={{ width: '6em' }}>
							&#8377; {69420}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton color='inherit'>
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default CartContentCard;
