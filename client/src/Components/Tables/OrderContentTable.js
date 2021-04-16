import {
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableBody,
	makeStyles,
	Link
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	link: {
		color: 'inherit',
		'&:hover': {
			textDecoration: 'none'
		}
	},
	text: {
		fontSize: 16
	},
	table: {
		minWidth: '60vw'
	}
}));

const OrderContentTable = ({ order_content, order_no }) => {
	const classes = useStyles();

	return (
		<TableContainer>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell colSpan={4} align='center' style={{ fontSize: '20pt' }}>
							<b>Order #{order_no}</b>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableHead>
					<TableRow>
						<TableCell className={classes.text}>
							<b>Item name</b>
						</TableCell>
						<TableCell align='center' className={classes.text}>
							<b>Quantity</b>
						</TableCell>
						<TableCell className={classes.text}>
							<b>Price</b>
						</TableCell>
						<TableCell className={classes.text}>
							<b>Total Price</b>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{order_content.map((item, i) => {
						return (
							<TableRow key={item.itemno}>
								<TableCell className={classes.text}>
									<Link
										href='#'
										onClick={() => console.log(item.itemname)}
										className={classes.link}
									>
										{item.itemname}
									</Link>
								</TableCell>
								<TableCell align='center' className={classes.text}>
									{item.quantity}
								</TableCell>
								<TableCell className={classes.text}>{item.price}</TableCell>
								<TableCell className={classes.text}>
									{item.quantity * item.price}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
				<TableHead>
					<TableRow>
						<TableCell className={classes.text}>
							<b>Grand Total</b>
						</TableCell>
						<TableCell align='center' className={classes.text}>
							<b>
								{order_content.reduce(
									(quantity, item) => quantity + parseInt(item.quantity),
									0
								)}
							</b>
						</TableCell>
						<TableCell className={classes.text}></TableCell>
						<TableCell className={classes.text}>
							<b>
								{order_content.reduce(
									(price, item) => price + item.price * item.quantity,
									0
								)}
							</b>
						</TableCell>
						<TableCell className={classes.text}></TableCell>
					</TableRow>
				</TableHead>
			</Table>
		</TableContainer>
	);
};

export default OrderContentTable;
