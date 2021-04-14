import React, { useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		marginTop: theme.spacing(2),
		width: '100vw'
	},
	formElement: {
		marginTop: theme.spacing(2),
		width: '40vw'
	},
	adjacent: {
		width: '19.5vw'
	},
	submit: {
		marginTop: theme.spacing(2),
		width: '40vw'
	}
}));

const RestReg = () => {
	const classes = useStyles();

	const [uname, setUname] = useState(null);
	const [unameStatus, setUnameStatus] = useState('CHECK');
	const [pass, setPass] = useState(null);
	const [confirm, setConfirm] = useState(null);
	const [error, setError] = useState(false);
	const [firstname, setFirstname] = useState(null);
	const [lastname, setLastname] = useState(null);
	const [phone, setPhone] = useState(null);
	const [email, setEmail] = useState(null);
	const [fssai, setFssai] = useState(null);
	const [rest_name, setRest_name] = useState(null);
	const [img_link, setImg_link] = useState(null);
	const [aline1, setAline1] = useState(null);
	const [aline2, setAline2] = useState(null);
	const [city, setCity] = useState(null);
	const [pin, setPin] = useState(null);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [isVeg, setIsVeg] = useState(false);
	const [phones, setPhones] = useState([]);
	const [newPhone, setNewPhone] = useState(null);

	const history = useHistory();

	const submitHandler = async (e) => {
		e.preventDefault();
		if (pass !== confirm) {
			setError(true);
			setPass('');
			setConfirm('');
		} else {
			const details = {
				type: 'restaurant',
				uname,
				pass,
				firstname,
				lastname,
				phone,
				email,
				fssai,
				rest_name,
				img_link,
				aline1,
				aline2,
				city,
				pin,
				lat,
				long,
				isVeg,
				phones
			};
			try {
				await axios.post('http://localhost:5000/signup', details);
				history.push('/signin');
			} catch (err) {
				console.log(err.response.data.message);
			}
		}
	};

	const checkUname = async (e) => {
		if (uname !== '') {
			try {
				const res = await axios.get('http://localhost:5000/signup', { params: { uname } });
				if (res.data.isTaken) setUnameStatus('TAKEN');
				else setUnameStatus('OK');
			} catch (err) {
				console.log(err.response.data.message);
			}
		}
	};

	return (
		<form onSubmit={submitHandler}>
			<Grid container className={classes.paper}>
				<Grid item className={classes.formElement}>
					<Typography variant='h6'>Manager Details</Typography>
				</Grid>
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item>
						<TextField
							variant='outlined'
							label='Username'
							required
							fullWidth
							style={{ width: '30vw' }}
							onChange={(e) => {
								setUname(e.target.value);
								setUnameStatus('CHECK');
							}}
							error={unameStatus === 'TAKEN'}
						/>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							color='primary'
							style={{ height: '3.5vw', width: '9vw' }}
							startIcon={
								(unameStatus === 'CHECK' && <HelpOutlineOutlinedIcon />) ||
								(unameStatus === 'TAKEN' && <CloseOutlinedIcon />) ||
								(unameStatus === 'OK' && <DoneIcon />)
							}
							disabled={unameStatus === 'OK'}
							onClick={checkUname}
						>
							{unameStatus}
						</Button>
					</Grid>
				</Grid>
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='Password'
							type='password'
							required
							fullWidth
							onChange={(e) => {
								setPass(e.target.value);
							}}
							error={error}
						/>
					</Grid>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='Confirm Password'
							type='password'
							required
							fullWidth
							onChange={(e) => {
								setConfirm(e.target.value);
							}}
							error={error}
						/>
					</Grid>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='First Name'
						required
						fullWidth
						onChange={(e) => {
							setFirstname(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Last Name'
						fullWidth
						onChange={(e) => {
							setLastname(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Phone'
						type='tel'
						required
						fullWidth
						onChange={(e) => {
							setPhone(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Email Address'
						type='email'
						required
						fullWidth
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<Typography variant='h6'>Restaurant Details</Typography>
				</Grid>
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item>
						<Grid item>
							<TextField
								variant='outlined'
								label='FSSAI Number'
								type='tel'
								style={{ width: '30vw' }}
								required
								fullWidth
								onChange={(e) => {
									setFssai(e.target.value);
								}}
							/>
						</Grid>
					</Grid>
					<Grid item>
						<FormControlLabel
							control={
								<Checkbox
									chcked={isVeg}
									onChange={(e) => setIsVeg(e.target.checked)}
								/>
							}
							label='Pure Veg?'
						/>
					</Grid>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Restaurant Name'
						required
						fullWidth
						onChange={(e) => {
							setRest_name(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Image Link (to be updated)'
						required
						fullWidth
						onChange={(e) => {
							setImg_link(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<Typography variant='h6' style={{ fontWeight: 'bold' }}>
						Restaurant contact numbers
					</Typography>
				</Grid>
				{phones.map((p, i) => (
					<Grid container className={classes.formElement} justify='space-between'>
						<Grid item>
							<Typography variant='h6' style={{ width: '30vw' }}>
								{p}
							</Typography>
						</Grid>
						<Grid item>
							<Button
								variant='contained'
								color='primary'
								style={{ height: '3.5vw', width: '9vw' }}
								startIcon={<DeleteIcon />}
								onClick={() => {
									const removed = phones.filter((ph, idx) => idx !== i);
									setPhones(removed);
								}}
							>
								DELETE
							</Button>
						</Grid>
					</Grid>
				))}
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item>
						<TextField
							variant='outlined'
							label='Phone'
							value={newPhone}
							type='tel'
							fullWidth
							style={{ width: '30vw' }}
							onChange={(e) => {
								setNewPhone(e.target.value);
							}}
						/>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							color='primary'
							style={{ height: '3.5vw', width: '9vw' }}
							startIcon={<AddIcon />}
							onClick={() => {
								setPhones(phones.concat([newPhone]));
								setNewPhone('');
							}}
						>
							ADD
						</Button>
					</Grid>
				</Grid>
				<Grid item className={classes.formElement}>
					<Typography variant='h6'>Address</Typography>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Address Line 1'
						required
						fullWidth
						onChange={(e) => {
							setAline1(e.target.value);
						}}
					/>
				</Grid>
				<Grid item className={classes.formElement}>
					<TextField
						variant='outlined'
						label='Address Line 2'
						fullWidth
						onChange={(e) => {
							setAline2(e.target.value);
						}}
					/>
				</Grid>
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='City'
							required
							fullWidth
							onChange={(e) => {
								setCity(e.target.value);
							}}
						/>
					</Grid>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='Pin Code'
							type='tel'
							required
							fullWidth
							onChange={(e) => {
								setPin(e.target.value);
							}}
						/>
					</Grid>
				</Grid>
				<Grid container className={classes.formElement} justify='space-between'>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='Latitude'
							required
							fullWidth
							onChange={(e) => {
								setLat(e.target.value);
							}}
						/>
					</Grid>
					<Grid item className={classes.adjacent}>
						<TextField
							variant='outlined'
							label='Longitude'
							required
							fullWidth
							onChange={(e) => {
								setLong(e.target.value);
							}}
						/>
					</Grid>
				</Grid>
				<Grid item className={classes.formElement}>
					<Button
						variant='contained'
						type='submit'
						id='submit'
						color='primary'
						className={classes.submit}
					>
						Sign Up
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

export default RestReg;
