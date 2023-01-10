import { createApi } from 'unsplash-js';

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
});

const getListOfCoffeeStoreImages = async () => {
	const results = await unsplash.search.getPhotos({
		query: 'coffee shop',
		page: 1,
		perPage: 30,
	});

	const unsplashResults = results.response.results || [];
	return unsplashResults.map((result) => result.urls["small"]);
}

const getUrlForCoffeeStores = (latLng, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLng}&limit=${limit}`
}

export const fetchCoffeeStores = async (latLng = '43.653833032607096,-79.37896808855945', limit = 6) => {
	const photos = await getListOfCoffeeStoreImages();
	const options = {
		method: 'GET',
		headers: {
		  accept: 'application/json',
		  Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
		}
	};
	
	try {
		const response = await fetch(
			getUrlForCoffeeStores(latLng, 'coffee', limit),
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