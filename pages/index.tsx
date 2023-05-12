import Head from "next/head";
import {GetServerSideProps} from "next";
import {NewsArticle, NewsResponse} from "@/models/NewsArticles";
import NewsArticlesGrid from "@/components/NewsArticlesGrid";
import {Alert} from "react-bootstrap";

interface BreakingNewsPageProps {
	newsArticles: NewsArticle[];
}

export const getServerSideProps: GetServerSideProps<BreakingNewsPageProps> = async () => {
	const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
	const newsResponse: NewsResponse = await response.json();
	return {
		props: { newsArticles: newsResponse.articles }
	}
	// let error go to 500 page
}

export default function BreakingNewsPage({newsArticles}: BreakingNewsPageProps) {

	return (
		<>
			<Head>
				<title key='title'>Breaking News - NextJS News Blog App</title>
			</Head>
			<main className=''>
				<h1>Breaking News</h1>
				<Alert>
					This page uses getServerSideProps to fetch data server-side on every request. This allows search
					engines to crawl the page content and improves SEO.
				</Alert>
				{<NewsArticlesGrid articles={newsArticles}/>}
			</main>
		</>
	)
}
