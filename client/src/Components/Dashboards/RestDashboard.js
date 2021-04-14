import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Tabs,
	Tab,
	Badge,
	Grid,
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import StarRateIcon from '@material-ui/icons/StarRate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import ItemCard from '../Cards/ItemCard';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(1)
	},
	grow: { flexGrow: 1 }
}));

const RestDashboard = () => {
	const classes = useStyles();

	const [value, setValue] = useState(0);
	const [items, setItems] = useState([]);
	const [pending, setPending] = useState([]);
	const filters = useSelector((state) => state.var.filters);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get('/items', { params: filters });
				setItems(res.data);
				const orders = await axios.get('/orders', { params: { pending: true } });
				setPending(orders.data);
			} catch (err) {
				console.log(err.response.data.message);
			}
		};

		fetchData();
	}, [filters]);

	const ItemsTab = () => {
		return (
			<Grid container spacing={2} alignItems='stretch'>
				{items.map((item) => (
					<Grid
						item
						key={`${item.fssai} ${item.itemno}`}
						xs={3}
						style={{ display: 'flex' }}
					>
						<ItemCard item={item} type='restaurant' />
					</Grid>
				))}
			</Grid>
		);
	};

	const Order = ({ order }) => {
		const [prepared, setPrepared] = useState(order.isprepared);

		return (
			<Accordion
				key={order.orderno}
				style={{ backgroundColor: prepared ? '#defffe' : 'inherit' }}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6' className={classes.grow}>
						Order <b>#{order.orderno}</b> placed by <b>{order.customer}</b> at{' '}
						{moment(order.ordertime).format('h:mm A')}
					</Typography>
					<Tooltip title='Prepared'>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								setPrepared(true);
							}}
							disabled={prepared}
						>
							<DoneIcon fontSize='large' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Dispatched'>
						<IconButton onClick={(e) => e.stopPropagation()}>
							<DoneAllIcon fontSize='large' />
						</IconButton>
					</Tooltip>
				</AccordionSummary>
				<AccordionDetails>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<b>Item number</b>
									</TableCell>
									<TableCell>
										<b>Item name</b>
									</TableCell>
									<TableCell>
										<b>Quantity</b>
									</TableCell>
									<TableCell>
										<b>Total Price</b>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order.contents.map((item) => {
									return (
										<TableRow key={item.itemno}>
											<TableCell>{item.itemno}</TableCell>
											<TableCell>{item.itemname}</TableCell>
											<TableCell>{item.quantity}</TableCell>
											<TableCell>{item.price}</TableCell>
										</TableRow>
									);
								})}
								<TableRow>
									<TableCell>-</TableCell>
									<TableCell>
										<b>Grand Total</b>
									</TableCell>
									<TableCell>
										<b>
											{order.contents.reduce(
												(a, b) => a + parseFloat(b.quantity),
												0
											)}
										</b>
									</TableCell>
									<TableCell>
										<b>
											{order.contents.reduce(
												(a, b) => a + parseFloat(b.price),
												0
											)}
										</b>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</AccordionDetails>
			</Accordion>
		);
	};

	const PendingTab = () => {
		return (
			<div>
				{pending.map((order) => (
					<Order order={order} />
				))}
			</div>
		);
	};

	const ReviewsTab = () => {
		return <h1>REVIEWS</h1>;
	};

	return (
		<div className={classes.root}>
			<Tabs
				value={value}
				onChange={(e, newValue) => setValue(newValue)}
				indicatorColor='primary'
				textColor='primary'
				centered
			>
				<Tab icon={<FastfoodIcon />} label='Items' />
				<Tab
					icon={
						<Badge badgeContent={pending.length} color='secondary'>
							<AssignmentTurnedInIcon />
						</Badge>
					}
					label='Pending'
				/>
				<Tab icon={<StarRateIcon />} label='Reviews' />
			</Tabs>
			{value === 0 && <ItemsTab />}
			{value === 1 && <PendingTab />}
			{value === 2 && <ReviewsTab />}
		</div>
	);
};

export default RestDashboard;
