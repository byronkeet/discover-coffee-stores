import React from 'react';
import  { useRouter } from 'next/router';
import Link from 'next/link';

const CoffeeStore = () => {
	const router = useRouter();
	console.log(router);
	return (
		<div>coffee Store with id: {router.query.id} <Link href='/'>Back to home</Link></div>
		
	)
}

export default CoffeeStore;