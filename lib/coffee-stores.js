import { RuleTester } from 'eslint';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const getListOfCoffeeStoreImages = async () => {
	const results = await unsplash.search.getPhotos({
		query: 'coffee shop',
		page: 1,
		perPage: 30,
	});

	return results.response.results.map(result => result.urls['small']);
}

const getUrlForCoffeeStores = (lat, lng, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${lng}&limit=${limit}`
}

export const fetchCoffeeStores = async () => {
	const photos = await getListOfCoffeeStoreImages();
	const options = {
		method: 'GET',
		headers: {
		  accept: 'application/json',
		  Authorization: process.env.FOURSQUARE_API_KEY
		}
	};
	
	try {
		const response = await fetch(
			getUrlForCoffeeStores('43.653833032607096', '-79.37896808855945', 'coffee', 6),
			options
		);

		const data = await response.json();
		
		const mappedData =  data.results.map((result, i) => {
			return {
				id: result.fsq_id,
				name: result.name,
				address: result.location.address,
				neighborhood: result.location.neighborhood && result.location.neighborhood.length > 0 ? result.location.neighborhood[0] : '',
				imgUrl: photos.length > 0 ? photos[i] : 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
			}
		});
		return mappedData;
	} catch (err) {
		console.error(err);
	}
}