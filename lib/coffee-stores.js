const getUrlForCoffeeStores = (lat, lng, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${lng}&limit=${limit}`
}

export const fetchCoffeeStores = async () => {
	const options = {
		method: 'GET',
		headers: {
		  accept: 'application/json',
		  Authorization: process.env.FOURSQUARE_API_KEY
		}
	};
	
	try {
		const response = await fetch(
			getUrlForCoffeeStores('-33.7896601', '18.9521995', 'coffee', 6),
			options
		);

		const data = await response.json();

		return data.results;
	} catch (err) {
		console.error(err);
	}
}