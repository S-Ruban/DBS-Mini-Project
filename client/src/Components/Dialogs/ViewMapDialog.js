import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent } from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { getCenter } from 'geolib';

const ViewMapDialog = ({ open, setOpen }) => {
	const details = useSelector((state) => state.socket.orderDetails);

	return (
		<Dialog
			open={open}
			onClose={() => {
				setOpen(false);
			}}
		>
			<DialogContent>
				<MapContainer
					center={getCenter(
						{ latitude: details.customer.lat, longitude: details.customer.long },
						{ latitude: details.restaurant.lat, longitude: details.restaurant.long },
						{ latitude: details.delivery.lat, longitude: details.delivery.long }
					)}
					zoom={14}
					scrollWheelZoom={false}
					style={{ height: '50vh', width: '35vw' }}
				>
					<TileLayer
						attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
						url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
						maxZoom={18}
						id='mapbox/streets-v11'
						tileSize={512}
						zoomOffset={-1}
						accessToken={process.env.REACT_APP_MAPBOX}
					/>
					<Marker
						position={[details.customer.lat, details.customer.long]}
						title={details.customer.firstname}
					/>
					<Marker
						position={[details.restaurant.lat, details.restaurant.long]}
						title={details.restaurant.rest_name}
					/>
					<Marker
						position={[details.delivery.lat, details.delivery.long]}
						title={details.delivery.first_name}
					/>
					<Polyline
						pathOptions={{ color: 'purple' }}
						positions={[
							[details.customer.lat, details.customer.long],
							[details.restaurant.lat, details.restaurant.long],
							[details.delivery.lat, details.delivery.long]
						]}
					/>
				</MapContainer>
			</DialogContent>
		</Dialog>
	);
};

export default ViewMapDialog;
