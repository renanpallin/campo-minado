import React from 'react';

export default class PossibleBomb extends React.Component {
	constructor(props){
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		this.props.clickBomb(e);
	}

	render(){
		return (
			<button className="square"
							id={this.props.id}
							onClick={this.handleClick}
							data-bomb={this.props.isBomb} >
							{this.props.children}
			</button>
		)
	}
}