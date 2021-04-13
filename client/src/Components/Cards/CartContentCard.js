import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, IconButton, Input, Link, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import FastfoodIcon from '@material-ui/icons/Fastfood';

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
}));

const CartContentCard = ({ initQuantity }) => {
	const classes = useStyles();
	const [quantity, setQuantity] = useState(initQuantity);

	const clickHandler = () => {
		console.log(1234);
	};

	return (
		<Card className={classes.root}>
			<CardContent>
				<Grid container justify='space-evenly' alignItems='center'>
					<Grid item>
						<FastfoodIcon fontSize='large' />
					</Grid>
					<Grid item>
						<Typography variant='h5' onClick={clickHandler}>
							<Link href='#' onClick={clickHandler} className={classes.link}>
								Food Item
							</Link>
						</Typography>
					</Grid>
					<Grid item>
						<Grid container justify='center' alignItems='center' spacing={1}>
							<Grid item style={{ width: '10em' }}>
								<IconButton
									color='inherit'
									disabled={quantity === 0}
									onClick={() => setQuantity(quantity - 1)}
								>
									<RemoveIcon />
								</IconButton>
								<Input
									variant='outlined'
									value={quantity}
									onChange={(e) => {
										//If quantity = 0 need to delete
										if (isNaN(e.target.value)) setQuantity(quantity);
										else if (!e.target.value) setQuantity(0);
										else setQuantity(parseInt(e.target.value));
									}}
									className={classes.quant}
								/>
								<IconButton
									color='inherit'
									onClick={() => setQuantity(quantity + 1)}
								>
									<AddIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Typography variant='h5' style={{ width: '6em' }}>
							&#8377; {69 * quantity}
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
