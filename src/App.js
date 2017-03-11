import React from 'react';

import Scores from './components/Scores';
import Board from './components/Board';

import PossibleBomb from './components/PossibleBomb';

export default class App extends React.Component {
	constructor(props){
		super(props);

		this.MAX_SQUARES = 10**2;
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
						displayValue: 0,
						_equals: function(id){
											// console.log('this', this.id);
											return this.id.x === id.x && this.id.y === id.y;
										}
					})
				)
			);



				/**
				 * Recebe um par ordenado (plano carteziano) e
				 * executa o callback para cada vizinho do square
				 * @param  {[Object]}   id  {x, y}
				 * 
				 * Na verdade deveríamos 'extender' o array e 
				 * colocar este método lá... mas nem sei se dá pra fazer isso no JS
				 */
				Array.prototype._callNeighbors = function(id, callback){
					// console.log(id);
					let {x, y} = id;
					/* Laterais */
					callback.call(this, {x: x  , y: y+1});
					callback.call(this, {x: x  , y: y-1});
					callback.call(this, {x: x+1, y: y  });
					callback.call(this, {x: x-1, y: y  });

					/* Diagonais */
					callback.call(this, {x: x+1, y: y+1});
					callback.call(this, {x: x+1, y: y-1});
					callback.call(this, {x: x-1, y: y+1});
					callback.call(this, {x: x-1, y: y-1});
				}

				/**
				 * Incrementa 1 no displayVale dos vizinhos
				 * @param  {[Object]}   id  {x, y}
				 * @return {[type]}    [description]
				 */
				Array.prototype._incrementDisplay = function(id){
					// console.log("incrementDisplay", id);
					let {y, x} = id;
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
					[y, x] = [x, y];
					if (this[x] && this[x][y] && !this[x][y].isBomb){
						// console.log("Incrementando", this[x][y].id, this[x][y])
						this[x][y].displayValue++;
					}
				}

				Array.prototype.incrementNeighbors = function(id){
					this._callNeighbors(id, this._incrementDisplay);
				};

				/**
				 * Recebe um square NÃO bomba e abre os vizinhos numéricos
				 * @param  {[Object]}   id  {x, y}
				 */
				Array.prototype.openNeighbors = function(id){
					this._callNeighbors(id, )
				};

		/* Mock de bombs */
			// arrayBombs[0][2].isBomb = true;
			// arrayBombs[1][2].isBomb = true;
			// arrayBombs[3][2].isBomb = true;
			// arrayBombs[1][1].isBomb = true;

		arrayBombs.map((line, lineIndex, matriz) => {

				// matriz.incrementDisplay = function(y, x){
				// 	if (this[x] && this[x][y] && !this[x][y].isBomb){
				// 		// console.log("Incrementando", this[x][y].id, this[x][y])
				// 		this[x][y].displayValue++;
				// 	}
				// }

				/* ==> O que está no protype é usado aqui <=== */

				line.map((bomb, i) => {
					// console.log("Bomb =>", bomb);

					if (!bomb.isBomb)
						return bomb;

					// console.log('---- BOMBA ENCONTRADA ----', bomb.id);
					bomb.displayValue = "*";


					// matriz.callNeighbors(bomb.id, incrementDisplay);
					matriz.incrementNeighbors(bomb.id);

					// console.log("Before", matriz[x][y]);
					// matriz.get(x, y).displayValue = 'CARALHO MAANOOO';
					// console.log("After", matriz[x][y]);

				})
			}
		)

		// console.log('ARRAY BOMBS \n', arrayBombs);
		this.state = {
			squares: arrayBombs
		}
	}

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
		// console.log(this.state.squares);

		let parString = e.target.id.split('-');
		let idClicado = {
			x: parseInt(parString[0]),
			y: parseInt(parString[1])
		}

		console.log(idClicado);
		// console.log(this.state.squares);

		let squares = this.state.squares.map((line, lineIndex, matriz) => 
			line.map(bomb => {
				if(bomb._equals(idClicado)){
					bomb.wasClicked = true;

					if(bomb.isBomb){
						console.warn("BOOOOOOOOMMMMMMM");
					} else {
						matriz._callNeighbors(bomb.id, ({x, y}) =>{
							[x, y] = [y, x];
							console.log("Checando", x, y);
							if(matriz[x] && matriz[x][y] && !matriz[x][y].isBomb){
								matriz[x][y].wasClicked = true;
							}
						});
					}
				}
				return bomb;
			})
		);

		// console.log(squares);
		// squares[e.target.id].wasClicked = true;
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
									{bomb.wasClicked ? bomb.displayValue : ""}

						</PossibleBomb>
		})
									// 

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