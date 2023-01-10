import { useState } from "react";

const useTrackLocation = () => {
	const [locationErrorMsg, setLocationErrorMsg] = useState('');
	const [latLng, setLatLng] = useState('');
	const [isFindingLocation, setIsFindingLocation] = useState(false);

	const success = (position) => {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		setLatLng(`${lat},${lng}`);
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
		latLng,
		locationErrorMsg,
		handleTrackLocation,
		isFindingLocation
	}
}

export default useTrackLocation;