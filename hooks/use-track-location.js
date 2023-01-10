import { useState } from "react";

const useTrackLocation = () => {
	const [locationErrorMsg, setLocationErrorMsg] = useState('');
	const [latLong, setLatLong] = useState('');
	const [isFindingLocation, setIsFindingLocation] = useState(false);

	const success = (position) => {
		const lat = position.coords.latitude;
		const long = position.coords.longitude;

		setLatLong(`${lat},${long}`);
		setLocationErrorMsg('');
		setIsFindingLocation(false);
	}

	const error = () => {
		setLocationErrorMsg('Unable to retrieve your location');
		setIsFindingLocation(false);
	}

	const handleTrackLocation = () => {
		setIsFindingLocation(true);

		if (!navigator.geolocation) {
			setLocationErrorMsg('Geolocation is not supported by your browser');
			setIsFindingLocation(false);
		} else {
			navigator.geolocation.getCurrentPosition(success, error);
		}
	};

	return {
		latLong,
		locationErrorMsg,
		handleTrackLocation,
		isFindingLocation
	}
}

export default useTrackLocation;