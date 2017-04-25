import React from 'react';

import Scores from './components/Scores';
import Board from './components/Board';

import PossibleBomb from './components/PossibleBomb';

export default class App extends React.Component {
	constructor(props){
		super(props);

		this.MAX_SQUARES = 4**2;
		let lado = Math.sqrt(this.MAX_SQUARES);
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

		/* Mock de bombs */
		// arrayBombs[0][2].isBomb = true;
		// arrayBombs[1][2].isBomb = true;
		// arrayBombs[3][2].isBomb = true;
		// arrayBombs[1][1].isBomb = true;

		arrayBombs.map((line, lineIndex, matriz) => {
				/** ATENÇÃO!!!!
				 * Javascript não possui array bidimensiona.
				 * Para solucionar isso, matriz é um array de arrays,
				 * onde o primeiro array representam as linhas da minha matriz
				 * e o segunto array, as "colunas" desta linha, que vem a ser um 
				 * único objeto.
				 * No plano carteziano (que é para onde minha função geradora de
				 * id foi feita), buscamos primeiro a coluna X e depois a linha Y,
				 * aqui, temos que buscar o contrário, primeiro nossa linha Y e 
				 * depois nossa coluna X.
				 *
				 * Por este motivo, para simular um array bidimensional e lê-lo
				 * com pares ordenados similares aos do plano carteziano, x e y
				 * foram invertidos nos parâmetros desta função.
				 */
				matriz.incrementDisplay = function(y, x){
					if (this[x] && this[x][y]){
						// console.log("Incrementando", this[x][y].id)
						this[x][y].displayValue++;
					}
				}


				line.map((bomb, i) => {
					// console.log("Bomb =>", bomb);

					if (!bomb.isBomb)
						return bomb;

					// console.log('---- BOMBA ENCONTRADA ----', bomb.id);

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

					this.done = true;
					// console.log("Before", matriz[x][y]);
					// matriz.get(x, y).displayValue = 'CARALHO MAANOOO';
					// console.log("After", matriz[x][y]);

				})
			}
		)

		this.state = {
			squares: arrayBombs
		}
	}

	componentDidMount(){
		console.log("Did mount", this.state.squares.map(e => e.id));
		// window.g = this.getGeneratorId(5);
		// for (let value of g){
		// 	console.log(value)
		// }
		// console.log(g)
	}

	getGeneratorId(cols){
		return (function* idMaker(cols){
			let x = 0;
			let y = 0;

			while (y < cols) {
				yield {x: x++,y}

				if (x >= cols){
					x = 0;
					++y;
				}
			}
		})(cols)
	}

	handleClick(e){
		console.log(e.target);
		let squares = this.state.squares.slice();
		squares[e.target.id].wasClicked = true;
		this.setState({squares});
		// console.log('atualizado');
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

		let linguiçonaHTML = linguiçona.map(bomb => {
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

		// console.log('[LINGUIÇONA]', linguiçonaHTML);

		let board = [];

		let rowLength = Math.sqrt(n);
		let start = 0;
		let end = rowLength;
		let times = rowLength;
		while(times-- > 0){
			// console.log("[SLICE]", linguiçonaHTML.slice(start, end));
			board.push(<div key={times} className="board-row">{linguiçonaHTML.slice(start, end)}</div>);
			start += rowLength;
			end += rowLength;
		}
 
		// console.log("[BOARD]", board);

 		return board;
	}


	render(){
		let bombs = this.getSquaresBombs(this.MAX_SQUARES);
		// console.log("Render", bombs)
		// bombs = ['poha', 'caralho', 'buceta'].map(palavrao => <h1>palavrao</h1>)
		// console.log(bombs);
		return (
			<div>
				<Scores />
				<Board squares={bombs} />
			</div>
		)
	}
}