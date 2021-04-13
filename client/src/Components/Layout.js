import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import axios from 'axios';
import {
	makeStyles,
	fade,
	AppBar,
	Link,
	Toolbar,
	Typography,
	InputBase,
	IconButton,
	Badge,
	Tooltip,
	Menu,
	MenuItem
} from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import HistoryIcon from '@material-ui/icons/History';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { signout } from '../Redux/userSlice';

const useStyles = makeStyles((theme) => {
	return {
		toolbarspace: theme.mixins.toolbar,
		icon: {
			margin: theme.spacing(2)
		},
		grow: {
			flexGrow: 1
		},
		link: {
			color: 'inherit',
			'&:hover': {
				textDecoration: 'none'
			}
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25)
			},
			marginRight: theme.spacing(2),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(6),
				width: 'auto'
			}
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		inputRoot: {
			color: 'inherit'
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '50ch'
			}
		},
		uname: {
			marginInline: theme.spacing(2)
		},
		history: {
			color: 'inherit',
			marginRight: theme.spacing(2)
		}
	};
});

const Layout = ({ children }) => {
	const classes = useStyles();
	const user = useSelector((state) => state.user);
	const cartCount = useSelector((state) => state.cart.count);
	const [anchorEl, setAnchorEl] = useState(null);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {}, [cartCount]);

	const handleOpen = (e) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleProfile = () => {
		history.push('/profile');
		setAnchorEl(null);
	};
	const handleSignout = async () => {
		try {
			await axios.post('/signout');
			dispatch(signout());
			history.push('/signin');
			console.log('Signed Out!');
		} catch (err) {
			console.log(err.response.data.message);
		} finally {
			setAnchorEl(null);
		}
	};

	return (
		<div>
			<AppBar>
				<Toolbar>
					<FastfoodIcon className={classes.icon} fontSize='large' />
					<Typography variant='h3'>
						<Link href='/' className={classes.link}>
							FODS
						</Link>
					</Typography>
					{user.uname && user.type !== 'delivery' && (
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								placeholder='Search…'
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
							/>
						</div>
					)}
					<div className={classes.grow}></div>
					{user.type === 'customer' && (
						<Tooltip title='Cart'>
							<IconButton color='inherit'>
								<Badge badgeContent={cartCount} color='secondary'>
									<ShoppingCartIcon />
								</Badge>
							</IconButton>
						</Tooltip>
					)}
					{user.uname && (
						<Typography variant='h6' className={classes.uname}>
							Nandan H R
						</Typography>
					)}
					{user.uname && (
						<Tooltip title='Order History'>
							<IconButton className={classes.history}>
								<HistoryIcon fontSize='inherit' />
							</IconButton>
						</Tooltip>
					)}
					{user.uname && (
						<div>
							<IconButton color='inherit' onClick={handleOpen}>
								<AccountCircle />
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								keepMounted
								getContentAnchorEl={null}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center'
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center'
								}}
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								<MenuItem onClick={handleProfile}>Profile</MenuItem>
								<MenuItem onClick={handleSignout}>Sign Out</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
			<div>
				<div className={classes.toolbarspace} />
				{children}
			</div>
		</div>
	);
};

export default Layout;
