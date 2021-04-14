import React, { useState } from 'react';
import { Avatar, Card, CardContent, CardHeader, makeStyles, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
//import moment from 'moment';

const useStyles = makeStyles((theme) => ({
	root: {
		marginInline: theme.spacing(30),
		marginBlock: theme.spacing(4),
		borderColor: '#000000',
		borderWidth: '1px'
	},
	rating: {
		margin: theme.spacing(2)
	}
}));

const ReviewCard = ({ review }) => {
	const classes = useStyles();

	const [value, setValue] = useState(0);

	return (
		<Card className={classes.root} variant='outlined'>
			<CardHeader
				title='Customer name'
				subheader='time'
				avatar={<Avatar>N</Avatar>}
				action={
					<Rating
						value={value}
						onChange={(e, newValue) => setValue(newValue)}
						size='large'
						className={classes.rating}
					/>
				}
				titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
			/>
			<CardContent>
				<Typography variant='subtitle1'>This restaurant is really good!!</Typography>
			</CardContent>
		</Card>
	);
};

export default ReviewCard;
