import React from 'react';
import Search from './components/search.jsx';
import Results from './components/results.jsx';

function onSearch(data) {
    React.render(<Results data={data}/>, document.body);
}

React.render(<Search onSearch={onSearch}/>, document.body);