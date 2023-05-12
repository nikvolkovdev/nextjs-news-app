import React from 'react';
import {NewsArticle, NewsResponse} from "@/models/NewsArticles";
import {GetStaticPaths, GetStaticProps} from "next";
import NewsArticlesGrid from "@/components/NewsArticlesGrid";
import {useRouter} from "next/router";
import Head from "next/head";
import {Alert} from "react-bootstrap";

interface CategoryNewsPageProps {
	newsArticles: NewsArticle[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	const categorySlugs = [
		"business",
		"entertainment",
		"general",
		"health",
		"science",
		"sports",
		"technology"
	];

	const paths = categorySlugs.map(slug => ({params: { category: slug }}));

	return {
		paths,
		fallback: false
	}
}

export const getStaticProps: GetStaticProps<CategoryNewsPageProps> = async ({params}) => {
	const category = params?.category?.toString();
	const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`)
	const newsResponse: NewsResponse = await response.json();
	return {
		props: { newsArticles: newsResponse.articles },
		revalidate: 300,
	}
	// let error go to 500 page
}

const CategoryNewsPage = ({newsArticles}: CategoryNewsPageProps) => {
	const router = useRouter();
	const categoryName = router.query.category?.toString();

	const title = "Category: " + categoryName;

	return (
		<>
			<Head>
				<title key="title">{`${title} | NextJs News Blog`}</title>
			</Head>
			<Alert>
				This page uses getStaticProps for very high loading speed and incremental static regeneration to show
				the data not older than 5 minutes.
			</Alert>
			<main>
				<h1>{title}</h1>
				<NewsArticlesGrid articles={newsArticles} />
			</main>
		</>
	);
};

export default CategoryNewsPage;