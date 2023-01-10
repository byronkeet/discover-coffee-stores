import React, { useContext, useState, useEffect } from 'react';
import  { useRouter } from 'next/router';
import Link from 'next/link';

import Head from 'next/head';
import cls from "classnames";
import Image from 'next/image';
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

	const {
		state: { coffeeStores }
	} = useContext(StoreContext);

	const router = useRouter();
	const id = router.query.id;

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const findCoffeeStoreById = coffeeStores.find(coffeeStore => coffeeStore.id.toString() === id);
				setCoffeeStore(findCoffeeStoreById);
			}
		}
	}, [id, initialProps.coffeeStore, coffeeStores]);

	

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const { name, address, neighborhood, imgUrl } = coffeeStore;
	console.log(coffeeStore)

	const handleUpvoteButton = () => {
		console.log('handle upvote')
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
						<p className={styles.text}>1</p>
					</div>
					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
				</div>
			</div>
		</div>
	)
}

export default CoffeeStore;