import React from 'react';

import Scores from './components/Scores';
import Board from './components/Board';

import PossibleBomb from './components/PossibleBomb';

export default class App extends React.Component {
	constructor(props){
		super(props);

		this.MAX_BOMBS = 16;
		let lado = Math.sqrt(this.MAX_BOMBS);
		let idIterator = this.getGeneratorId(lado);

		/*
		[[bomb, bomb, bomb],
		[bomb, bomb, bomb],
		[bomb, bomb, bomb]]
		 */
		let arrayBombs = Array(lado)
			.fill(Array(lado).fill())
			.map(line => 
				line.map(e => 
					({
						id: idIterator.next().value,
						isBomb: Math.random() >= 0.7,
						wasClicked: false,
						displayValue: 0
					})
				)
			);


			// console.log('BUCETA', arrayBombs.map((linha, i) => linha.map(e => e.id)));



		arrayBombs.map((line, lineIndex, matriz) => {
				matriz.incrementDisplay = function(x, y){
					if (this[x] && this[x][y])
						return ++this[x][y].displayValue;
					return null
				}

				line.map((bomb, i) => {
					console.log("Bomb =>", bomb);

					if (!bomb.isBomb)
						return bomb;

					let {x, y} = bomb.id;

					/* Laterais */
					matriz.incrementDisplay(x, y+1);
					matriz.incrementDisplay(x, y-1);
					matriz.incrementDisplay(x+1, y);
					matriz.incrementDisplay(x-1, y);

					/* Diagonais */
					matriz.incrementDisplay(x+1, y+1);
					matriz.incrementDisplay(x+1, y-1);
					matriz.incrementDisplay(x-1, y+1);
					matriz.incrementDisplay(x-1, y-1);

					// console.log("Before", matriz[x][y]);
					// matriz.get(x, y).displayValue = 'CARALHO MAANOOO';
					// console.log("After", matriz[x][y]);

				})
			}
		)

					// console.log("x: ", x, "y: ",y);
				// console.log(matriz.get(x,y));	
				// console.log("Before", matriz[x][y]);
				// let current = matriz[x][y];
				// if(current && !current.isBomb)
				// 	current.displayValue99;
				// console.log("After", matriz[x][y]);
		// [[b1, b1, b1],
		// [b2, b2, b2]]
		// arrayBombs.map((bomb, i, arr) => {
		// 			if (!bomb.isBomb)
		// 				return bomb;
		// 			let key;

		// 			let {x, y} = bomb.id;
		// 			let incX = x + 1
		// 			if (arr[incX]){
		// 				arr[incX].displayValue++;
		// 				if (arr[incX + ])
		// 			}

		// 			console.log(bomb.id, "é uma bomba!");
		// 			/* Laterais */
		// 			if (arr[bomb.id.x + 1] && !arr[bomb.id + 1].isBomb)
		// 				arr[bomb.id + 1].displayValue++;

		// 			if (arr[bomb.id - 1] && !arr[bomb.id - 1].isBomb)
		// 				arr[bomb.id - 1].displayValue++;

		// 			if (arr[bomb.id + lado] && !arr[bomb.id + lado].isBomb)
		// 				arr[bomb.id + lado].displayValue++;

		// 			if (arr[bomb.id - lado] && !arr[bomb.id - lado].isBomb)
		// 				arr[bomb.id - lado].displayValue++;

		// 			/* Diagonais */
		// 			if (arr[bomb.id + lado + 1] && !arr[bomb.id + lado + 1].isBomb)
		// 				arr[bomb.id + lado + 1].displayValue++;

		// 			if (arr[bomb.id + lado - 1] && !arr[bomb.id + lado - 1].isBomb)
		// 				arr[bomb.id + lado - 1].displayValue++;

		// 			if (arr[bomb.id - lado + 1] && !arr[bomb.id - lado + 1].isBomb)
		// 				arr[bomb.id - lado + 1].displayValue++;

		// 			if (arr[bomb.id - lado - 1] && !arr[bomb.id - lado - 1].isBomb)
		// 				arr[bomb.id - lado - 1].displayValue++;

		// 			bomb.displayValue = "*";
		// 		})

		// console.log(arrayBombs);


		this.state = {
			squares: arrayBombs
		}
	}

	// componentDidMount(){
	// 	console.log("Did mount", this.state.squares.map(e => e.id));
	// }

	getGeneratorId(cols){
		return (function* idMaker(cols){
			let x = 0;
			let y = 0;

			while (y < cols) {
				if (x >= cols){
					x = 0;
					y++
				}
				yield {x: x++,y}
			}
		})(cols)
	}

	handleClick(e){
		console.log(e.target);
		let squares = this.state.squares.slice();
		squares[e.target.id].wasClicked = true;
		this.setState({squares});
		console.log('atualizado');
	}

	// bomb.wasClicked ? bomb.isBomb : false
	getSquaresBombs(n){
		let linguiçona = [];

		this.state.squares.map(line => {
			line.map(bomb => {
				linguiçona.push(bomb);
				return bomb;
			})
		})

		linguiçona.map(bomb => {
			let bombId = bomb.id.x + '-' + bomb.id.y;
			return <PossibleBomb 
								key={bombId}
								id={bombId}
								wasClicked={bomb.wasClicked}
								isBomb={bomb.isBomb} 
								clickBomb={e => this.handleClick(e)}>
									{bomb.isBomb ? "*" : bomb.displayValue}
						</PossibleBomb>
		})
									// {bomb.wasClicked ? bomb.displayValue : ""}

		// console.log('[LINGUIÇONA]', linguiçona);

		let board = [];

		let rowLength = Math.sqrt(n);
		let start = 0;
		let end = rowLength;
		let times = rowLength;
		while(times-- > 0){
			console.log("[SLICE]", linguiçona.slice(start, end));
			board.push(<div key={times} className="board-row">{linguiçona.slice(start, end)}</div>);
			start += rowLength;
			end += rowLength;
		}
 
		// console.log("[BOARD]", board);

 		return board;
	}


	render(){
		let bombs = this.getSquaresBombs(this.MAX_BOMBS);
		console.log("Render", bombs.constructor)
		return (
			<div>
				<Scores />
				<Board squares={bombs} />
			</div>
		)
	}
}