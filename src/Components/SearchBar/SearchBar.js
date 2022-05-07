import React from 'react';

import './SearchBar.css';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			term: ''
		};

		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	search() {
		this.props.onSearch(this.state.term);
	}

	handleTermChange(event) {
		this.setState({
			term: event.target.value
		});
	}

	componentDidMount() {
		const sessionStorageTerm = window.sessionStorage.getItem('term');
		if (sessionStorageTerm && this.state.term === '') {
			this.setState({
				term: sessionStorageTerm
			});
		};
	}

	render() {
		return (
			<div className="SearchBar">
				<input 
					placeholder="Enter A Song, Album, or Artist" 
					onChange={this.handleTermChange}
					value={this.state.term}
				/>
				<button
					className="SearchButton"
					onClick={this.search}
				>
					SEARCH
				</button>
			</div>
		);
	}
};

export default SearchBar;