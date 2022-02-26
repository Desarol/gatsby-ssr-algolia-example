import * as React from "react"
import { Link, GetServerDataProps, GetServerDataReturn } from "gatsby"
import qs from 'qs'
import { findResultsState } from 'react-instantsearch-dom/server'

import Layout from "../components/layout"
import Seo from "../components/seo"
import Algolia from "../components/Algolia"
import algoliasearch from "algoliasearch/lite"
import { useRef } from "react"
import { useState } from "react"

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const pathToSearchState = (path) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'instant_search',
};

const UsingSSR = ({ serverData }) => {
  const [searchState, setSearchState] = useState(serverData.searchState)
  const debouncedSetState = useRef(null)

  const onSearchStateChange = (nextSearchState) => {
    clearTimeout(debouncedSetState.current);

    debouncedSetState.current = setTimeout(() => {
      const url = searchStateToURL(nextSearchState);
      window.history.pushState({}, '', url)
    })

    setSearchState(nextSearchState)
  }

  return (
    <Layout>
      <Seo title="Using SSR" />
      <h1>SSR page</h1>
      <Algolia
        {...DEFAULT_PROPS}
        resultsState={serverData.resultsState}
        searchClient={searchClient}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange} />
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default UsingSSR

export async function getServerData(data: GetServerDataProps): GetServerDataReturn {
  const searchState = pathToSearchState(data.url);
  const resultsState = await findResultsState(Algolia, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    status: 200,
    props: {
      resultsState,
      searchState,
    }
  };
}
