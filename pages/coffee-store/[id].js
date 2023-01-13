import React, { useContext, useState, useEffect } from 'react';
import  { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import cls from "classnames";
import Image from 'next/image';
import useSWR from 'swr';

import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';

import styles from '../../styles/coffee-store.module.css';

export async function getStaticProps(staticProps) {
	const params = staticProps.params;
	const coffeeStoreData = await fetchCoffeeStores();
	const findCoffeeStoreById = coffeeStoreData.find(coffeeStore => coffeeStore.id.toString() === params.id);
	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
		}
	}
}

export async function getStaticPaths() {
	const coffeeStoreData = await fetchCoffeeStores();
	const paths = coffeeStoreData.map(coffeeStore => {
		return {
			params: { id: coffeeStore.id.toString() }
		}
	});
	return {
		paths,
		fallback: true
	}
}

const CoffeeStore = (initialProps) => {
	const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
	const [votingCount, setVotingCount] = useState(0);

	const router = useRouter();
	const id = router.query.id;

	const fetcher = (url) => fetch(url).then((res) => res.json());

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	const {
		state: { coffeeStores }
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, address, neighborhood, voting, imgUrl } = coffeeStore;
			const response = await fetch('/api/createCoffeeStore', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					name,
					address: address || '',
					neighborhood: neighborhood || '',
					voting: 0,
					imgUrl
				})
			});

			const dbCoffeeStore = await response.json();
		} catch (err) {
			console.error('Error creating coffee store', err);
		}
	}

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const coffeeStoreFromContext = coffeeStores.find(coffeeStore => coffeeStore.id.toString() === id);
				setCoffeeStore(coffeeStoreFromContext);
				handleCreateCoffeeStore(coffeeStoreFromContext)
			}
		} else {
			// SSG
			handleCreateCoffeeStore(initialProps.coffeeStore)
		}
	}, [id, initialProps.coffeeStore, coffeeStores]);

	

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const { name, address, neighborhood, imgUrl } = coffeeStore;

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favouriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});
		
			const dbCoffeeStore = await response.json();
		
			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error("Error upvoting the coffee store", err);
		}
	}

	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href='/'>← Back to home</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						src={imgUrl}
						alt={name}
						width={600}
						height={360}
						className={styles.storeImg}
					/>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address &&
						<div className={styles.iconWrapper}>
							<Image src='/static/icons/places.svg' width='24' height='24' alt='Address Icon' />
							<p className={styles.text}>{address}</p>
						</div>
					}
					{neighborhood &&
						<div className={styles.iconWrapper}>
							<Image src='/static/icons/nearMe.svg' width='24' height='24' alt='Neightbourhood icon Icon' />
							<p className={styles.text}>{neighborhood}</p>
						</div>
					}
					<div className={styles.iconWrapper}>
						<Image src='/static/icons/star.svg' width='24' height='24' alt='Rating Icon' />
						<p className={styles.text}>{votingCount}</p>
					</div>
					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
				</div>
			</div>
		</div>
	)
}

export default CoffeeStore;