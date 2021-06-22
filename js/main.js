let pantallaCarga = document.getElementById("pantallaCarga");
let pantallaJuego = document.getElementById("pantallaJuego");

let inputPlayer1 = document.getElementById("inputJugador1");
let inputPlayer2 = document.getElementById("inputJugador2");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");

let player1Score = document.getElementById("player1Score");
let player2Score = document.getElementById("player2Score");

let botonJugar = document.getElementById("botonJugar");
let botonReset = document.getElementById("botonReset");

let myModal = new bootstrap.Modal(document.getElementById("myModal"));
let modalTexto = document.getElementById("modalTexto");

let grillaContainer = document.querySelector(".grillaContainer");

let jugadasPlayer1 = [];
let jugadasPlayer2 = [];
let scorePartidaPlayer1 = 0;
let scorePartidaPlayer2 = 0;
let scoreTotalPlayer1 = [];
let scoreTotalPlayer2 = [];

let posicionesGanadoras = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

let ganador = false;
let contadorJugadas = 0;

//boton que da inicio al juego
botonJugar.addEventListener("click", function () {
	player1.innerHTML = inputPlayer1.value;
	player2.innerHTML = inputPlayer2.value;
	pantallaCarga.style.display = "none";
	pantallaJuego.style.display = "block";
});

//crea la clase de slots con los metodos para pintar cada slot
class Slot {
	constructor(contenedor, slotId) {
		this.contenedor = contenedor;
		this.slotClicked = false;
		this.slotId = slotId;
	}

	pintarRosa() {
		this.contenedor.classList.add("pink");
	}

	pintarVerde() {
		this.contenedor.classList.add("green");
	}
}

// instancia cada slot
const slots = [];

for (let i = 0; i < 9; i++) {
	slots.push(new Slot(document.getElementById("slot" + i), i));
}

// esta funcion recorre el array y agrega add event listener a cada slot
function agregarEventsSlots() {
	slots.forEach(slot => {
		slot.contenedor.addEventListener("click", () => jugar(slot));
	});
}

// invoca la funcion
agregarEventsSlots();

// esta funcion evalua el juego por cada movida de cada jugador
function jugar(slot) {
	let resultado = false;
	if (!ganador) {
		if (contadorJugadas % 2 === 0) {
			if (!slot.slotClicked) {
				slot.pintarRosa();
				jugadasPlayer1.push(slot.slotId);
				console.log(jugadasPlayer1);
				resultado = busqueda(posicionesGanadoras, jugadasPlayer1);
				slot.slotClicked = true;
				contadorJugadas++;
				if (resultado) {
					ganador = true;
					scorePartidaPlayer1++;
					scoreTotalPlayer1.push(scorePartidaPlayer1);
					console.log(scoreTotalPlayer1);
					updateScore(player1Score, scorePartidaPlayer1);
					console.log("gano player 1");
					modalTexto.innerText = `Felicitaciones ${inputPlayer1.value}, sos el ganador de esta partida`;
					myModal.show();
				} else if (!ganador && contadorJugadas === 9) {
					console.log("Es un empate");
					modalTexto.innerText = `Esta vez no gano nadie, es un empate`;
					myModal.show();
				}
			} else if (slot.slotClicked) {
				console.log("pinta otro");
			}
		} else if (contadorJugadas % 2 === 1) {
			if (!slot.slotClicked) {
				slot.pintarVerde();
				jugadasPlayer2.push(slot.slotId);
				console.log(jugadasPlayer2);
				resultado = busqueda(posicionesGanadoras, jugadasPlayer2);
				slot.slotClicked = true;
				contadorJugadas++;
				if (resultado) {
					ganador = true;
					scorePartidaPlayer2++;
					scoreTotalPlayer2.push(scorePartidaPlayer2);
					console.log(scoreTotalPlayer2);
					updateScore(player2Score, scorePartidaPlayer2);
					console.log("gano player 2");
					modalTexto.innerText = `Felicitaciones ${inputPlayer2.value}, sos el ganador de esta partida`;
					myModal.show();
				} else if (!ganador && contadorJugadas === 9) {
					console.log("Es un empate");
					modalTexto.innerText = `Esta vez no gano nadie, es un empate`;
					myModal.show();
				}
			} else if (slot.slotClicked) {
				console.log("pinta otro");
			}
		}
	} else if (ganador) {
		console.log("entro al if del slots");
	}
}

// esta funcion recibe dos arrays y verifica si en el arr2 estan todos los items del arr1
function busqueda(arr1, arr2) {
	let resultado = false;
	for (var i = 0; i < arr1.length; i++) {
		resultado = arr1[i].every(item => arr2.includes(item));
		console.log(resultado);
		if (resultado === true) {
			break;
		}
	}
	return resultado;
}

// esta funcion actualiza el score de cada jugador en el html
function updateScore(player, score) {
	player.innerHTML = score;
}

// esta funcion resetea las variables del juego
function resetJugar() {
	slots.forEach(slot => {
		slot.contenedor.classList.remove("pink");
		slot.contenedor.classList.remove("green");
		slot.slotClicked = false;
	});
	jugadasPlayer1 = [];
	jugadasPlayer2 = [];
	contadorJugadas = 0;
	ganador = false;
}

botonReset.addEventListener("click", resetJugar);
