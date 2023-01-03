import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/Banner';
import Card from '../components/card';

import styles from '../styles/Home.module.css';

export default function Home() {
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
			<Card name='DarkHorse Coffee' imgUrl='/static/hero-image.png' href='coffee-store/darkhorse-coffee' />
		</main>
		</div>
	)
}
