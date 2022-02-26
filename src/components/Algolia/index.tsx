import React from 'react';
import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  InstantSearchProps
} from 'react-instantsearch-dom';

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div>
      <div className="hit-picture">
        <img src={`${hit.image}`} />
      </div>
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
        <span> - ${hit.price}</span>
        <span> - {hit.rating} stars</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={hit} />
      </div>
    </div>
  </div>
);

type AlgoliaProps = InstantSearchProps

export default class extends React.Component<AlgoliaProps> {
  render() {
    return (
      <InstantSearch
        searchClient={this.props.searchClient}
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
        createURL={this.props.createURL}
        indexName={this.props.indexName}
        onSearchParameters={this.props.onSearchParameters}
        {...this.props}
      >
        <Configure hitsPerPage={12} />
        <header>
          <h1>React InstantSearch + Next.Js</h1>
          <SearchBox />
        </header>
        <main>
          <div className="menu">
            <RefinementList attribute="categories" />
          </div>
          <div className="results">
            <Hits hitComponent={HitComponent} />
          </div>
        </main>
        <footer>
          <Pagination />
          <div>
            See{' '}
            <a href="https://github.com/algolia/react-instantsearch/tree/master/examples/next">
              source code
            </a>{' '}
            on github
          </div>
        </footer>
      </InstantSearch>
    );
  }
}