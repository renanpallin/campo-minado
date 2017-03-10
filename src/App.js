import React from 'react';

import Scores from './components/Scores';
import Board from './components/Board';

import PossibleBomb from './components/PossibleBomb';

export default class App extends React.Component {
	constructor(props){
		super(props);

		let max = 16;
		let lado = Math.sqrt(max);
		let arrayBombs = Array(max).fill().map((e, id) => ({id,
					isBomb: Math.random() >= 0.7,
					wasClicked: false,
					displayValue: 0
				})
		);

		arrayBombs.map((bomb, i, arr) => {
					if (!bomb.isBomb)
						return bomb;


					/**
					 * BUG: 
					 * Está saindo do rage, justamente pelos ids serem lineares...
					 * coloca par ordenado nessa merda logo vai 
					 */
					

					console.log(bomb.id, "é uma bomba!");
					/* Laterais */
					if (arr[bomb.id + 1] && !arr[bomb.id + 1].isBomb)
						arr[bomb.id + 1].displayValue++;

					if (arr[bomb.id - 1] && !arr[bomb.id - 1].isBomb)
						arr[bomb.id - 1].displayValue++;

					if (arr[bomb.id + lado] && !arr[bomb.id + lado].isBomb)
						arr[bomb.id + lado].displayValue++;

					if (arr[bomb.id - lado] && !arr[bomb.id - lado].isBomb)
						arr[bomb.id - lado].displayValue++;

					/* Diagonais */
					if (arr[bomb.id + lado + 1] && !arr[bomb.id + lado + 1].isBomb)
						arr[bomb.id + lado + 1].displayValue++;

					if (arr[bomb.id + lado - 1] && !arr[bomb.id + lado - 1].isBomb)
						arr[bomb.id + lado - 1].displayValue++;

					if (arr[bomb.id - lado + 1] && !arr[bomb.id - lado + 1].isBomb)
						arr[bomb.id - lado + 1].displayValue++;

					if (arr[bomb.id - lado - 1] && !arr[bomb.id - lado - 1].isBomb)
						arr[bomb.id - lado - 1].displayValue++;

					bomb.displayValue = "*";
				})

		// console.log(arrayBombs);


		this.state = {
			squares: arrayBombs
		}
	}

	// componentDidMount(){
	// 	console.log("Did mount", this.state.squares.map(e => e.id));
	// }

	handleClick(e){
		console.log(e.target);
		let squares = this.state.squares.slice();
		squares[e.target.id].wasClicked = true;
		this.setState({squares});
		console.log('atualizado');
	}

	// bomb.wasClicked ? bomb.isBomb : false
	getSquaresBombs(n){
		let linguiçona = this.state.squares.map(bomb => {
			// let verdade = "";
			// if(bomb.wasClicked)
			// 	if(bomb.isBomb)
			// 		verdade = '*';
			// 	else
			// 		verdade = "1"
			

			// {bomb.wasClicked ? bomb.displayValue : ""}
			return <PossibleBomb 
								key={bomb.id}
								id={bomb.id}
								wasClicked={bomb.wasClicked}
								isBomb={bomb.isBomb} 
								clickBomb={e => this.handleClick(e)}>
									
									{bomb.displayValue}
						</PossibleBomb>
		});

		let board = [];

		let rowLength = Math.sqrt(n);
		let start = 0;
		let end = rowLength;
		let times = rowLength;
		while(times-- > 0){
			board.push(<div key={times} className="board-row">{linguiçona.slice(start, end)}</div>);
			start += rowLength;
			end += rowLength;
		}
 
		// console.log("[BOARD]",board);

 		return board;
	}


	render(){
		let bombs = this.getSquaresBombs(16);
		return (
			<div>
				<Scores />
				<Board squares={bombs} />
			</div>
		)
	}
}