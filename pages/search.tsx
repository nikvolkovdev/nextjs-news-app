import React, {FormEvent, useState} from 'react';
import {NewsArticle} from "@/models/NewsArticles";
import {Alert, Button, Form, Spinner} from "react-bootstrap";
import NewsArticlesGrid from "@/components/NewsArticlesGrid";
import Head from "next/head";


const SearchNewsPage = () => {
	const [searchResults, setSearchResults] = useState<NewsArticle[] | null>(null);

	const [searchResultsLoading, setSearchResultsLoading] = useState(false);
	const [searchResultsError, setSearchResultsError] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const searchQuery = formData.get("searchQuery")?.toString().trim();

		if (searchQuery) {
			try {
				setSearchResults(null);
				setSearchResultsError(false);
				setSearchResultsLoading(true);
				const response = await fetch('/api/search-news?q=' + searchQuery);
				const articles: NewsArticle[] = await response.json();
				setSearchResults(articles);
			} catch (error) {
				console.error(error);
				setSearchResultsError(true);
			} finally {
				setSearchResultsLoading(false);
			}
		}
	}

	return (
		<>
			<Head>
				<title key="title">Search News - NextJs News Blog App</title>
			</Head>
			<main>
				<h1>Search News</h1>
				<Alert>
					This page uses client-side data fetching to show fresh data for every search. Requests are handled by
					our backend via API routes.
				</Alert>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="search-input">
						<Form.Label>
							Search query
						</Form.Label>
						<Form.Control name="searchQuery" placeholder="e.g. politics, sports, ..."/>
					</Form.Group>
					<Button type="submit" className="mb-3" disabled={searchResultsLoading}>
						Search
					</Button>
				</Form>
				<div className="d-flex flex-column align-items-center">
					{searchResultsLoading && <Spinner animation="border"/>}
					{searchResultsError && <p>Something went wrong. Please try again.</p>}
					{searchResults?.length === 0 && <p>Nothing found. Try a different query.</p>}
					{searchResults && <NewsArticlesGrid articles={searchResults}/>}
				</div>
			</main>
		</>
	);
};

export default SearchNewsPage;