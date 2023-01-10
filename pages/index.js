import Head from 'next/head';
import Image from 'next/image';
import { Fragment } from 'react';

import Banner from '../components/Banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';

import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
	const coffeeStores = await fetchCoffeeStores();

	return {
		props: {
			coffeeStores: coffeeStores,
		}
	}
}

export default function Home({coffeeStores}) {
	const handleOnBannerBtnClick = () => {
		console.log('Hi from banner button')
	}
	return (
		<div className={styles.container}>
		<Head>
			<title>Coffee Connoisseur</title>
			<meta name="description" content="Generated by create next app" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<main className={styles.main}>
			<Banner
				buttonText='View stores nearby'
				handleOnClick={handleOnBannerBtnClick}
			/>
			<div className={styles.heroImage}>
				<Image src='/static/hero-image.png' width={700} height={400} alt='banner image'/>
			</div>
			{coffeeStores.length > 0 &&
			<Fragment>
				<h2 className={styles.heading2}>Toronto stores</h2>
				<div className={styles.cardLayout}>
					{coffeeStores.map((coffeeStore) => (
						<Card
							key={coffeeStore.id}
							name={coffeeStore.name}
							imgUrl={coffeeStore.imgUrl}
							href={`coffee-store/${coffeeStore.id}`}
							className={styles.card}
						/>
					))}

				</div>
			</Fragment>}
		</main>
		</div>
	)
}
