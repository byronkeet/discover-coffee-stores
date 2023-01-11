import { table, getMinifiedRecords, findRecordByFilter } from "../../lib/airtable";


const createCoffeeStore = async (req, res) => {

	if (req.method === 'POST') {
		const { id, name, address, neighborhood, voting, imgUrl } = req.body;
		try {
			if (!id) {
				res.status(400);
				res.json({ message: 'Id is missing' })
				return;
			}

			const records = await findRecordByFilter(id);

			if (records.length !== 0) {
				res.json(records);
			} else {
				// create a record
				if (!name) {
					res.status(400);
					res.json({ message: 'Name is missing' });
					return;
				}

				const createRecords = await table.create([
					{
						fields: {
							id,
							name,
							address,
							neighborhood,
							voting,
							imgUrl
						}
					}
				]);
				const records = getMinifiedRecords(createRecords);
				res.json(records)
			}
		} catch (err) {
			console.error('Error creating or finding store', err);
			res.status(500);
			res.json({ message: 'Error creating or finding store', err })
		}
	};
}

export default createCoffeeStore;

