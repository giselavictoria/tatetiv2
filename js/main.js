let pantallaCarga = document.getElementById("pantallaCarga");
let pantallaJuego = document.getElementById("pantallaJuego");

let inputPlayer1 = document.getElementById("inputJugador1");
let inputPlayer2 = document.getElementById("inputJugador2");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");

let player1Score = document.getElementById("player1Score");
let player2Score = document.getElementById("player2Score");

let botonJugar = document.getElementById("botonJugar");
let botonLimpiar = document.getElementById("botonLimpiar");
let botonReiniciarJuego = document.getElementById("botonReiniciarJuego");
let botonGuardarPartida = document.getElementById("botonGuardarPartida");

let myModal = new bootstrap.Modal(document.getElementById("myModal"));
let modalTexto = document.getElementById("modalTexto");

let jugadasPlayer1 = [];
let jugadasPlayer2 = [];
let scorePartidaPlayer1 = 0;
let scorePartidaPlayer2 = 0;
let scoreTotalPlayer1 = 0;
let scoreTotalPlayer2 = 0;

let listaJugadasPrevias = document.getElementById("listaJugadasPrevias");

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
	getName["nombre 1"] = inputPlayer1.value;
	getName["nombre 2"] = inputPlayer2.value;
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
		this.contenedor.classList.add("rosa");
	}

	pintarCeleste() {
		this.contenedor.classList.add("celeste");
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
					getData["Score Total Player 1"] = ++scoreTotalPlayer1; // actualiza el valor de la key en la posicion de memoria
					console.log(scoreTotalPlayer1);
					updateScore(player1Score, scorePartidaPlayer1);
					console.log("gano player 1");
					modalTexto.innerText = `¡Felicitaciones ${inputPlayer1.value}, ganaste esta partida!`;
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
				slot.pintarCeleste();
				jugadasPlayer2.push(slot.slotId);
				console.log(jugadasPlayer2);
				resultado = busqueda(posicionesGanadoras, jugadasPlayer2);
				slot.slotClicked = true;
				contadorJugadas++;
				if (resultado) {
					ganador = true;
					scorePartidaPlayer2++;
					getData["Score Total Player 2"] = ++scoreTotalPlayer2;
					console.log(scoreTotalPlayer2);
					updateScore(player2Score, scorePartidaPlayer2);
					console.log("gano player 2");
					modalTexto.innerText = `¡Felicitaciones ${inputPlayer2.value}, ganaste esta partida!`;
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

// esta funcion reinicia el juego
botonReiniciarJuego.addEventListener("click", function () {
	reiniciarJuego();
	limpiarTablero();
	clearScore(player1Score);
	clearScore(player2Score);
	clearGetData();
	clearGetName();
	/*localStorage.clear();*/
	player1.innerHTML = inputPlayer1.value;
	player2.innerHTML = inputPlayer2.value;
	pantallaCarga.style.display = "block";
	pantallaJuego.style.display = "none";
});

// esta funcion limpia el score
function clearScore(player) {
	player.innerHTML = 0;
}

// esta funcion limpia la posicion de memoria de los scores
function clearGetData() {
	getData["Score Total Player 1"] = 0;
	getData["Score Total Player 2"] = 0;
}

// esta funcion limpia la posicion de memoria de los nombres
function clearGetName() {
	getName["nombre 1"] = "";
	getName["nombre 2"] = "";
}

//esta funcion reinicia los valores para reiniciar el juego
function reiniciarJuego() {
	inputPlayer1.value = "";
	inputPlayer2.value = "";
	scorePartidaPlayer1 = 0;
	scorePartidaPlayer2 = 0;
	scoreTotalPlayer1 = 0;
	scoreTotalPlayer2 = 0;
	pepe = 0;
}

// esta funcion resetea las variables del juego
function limpiarTablero() {
	slots.forEach(slot => {
		slot.contenedor.classList.remove("rosa");
		slot.contenedor.classList.remove("celeste");
		slot.slotClicked = false;
	});
	jugadasPlayer1 = [];
	jugadasPlayer2 = [];
	contadorJugadas = 0;
	ganador = false;
}

// este boton ejecuta la funcion de limpiar el tablero
botonLimpiar.addEventListener("click", limpiarTablero);

// funcion para guardar en local storage
function saveLocalStorage(key, item) {
	let stringifiedItem = JSON.stringify(item);
	localStorage.setItem(key, stringifiedItem);
}

// funcion para traer el elemento del local storage
function getLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

// esto es un diccionario (par clave-valor), trae la info que se pasa al localstorage
let getData = {
	"Score Total Player 1": 0,
	"Score Total Player 2": 0,
};
let getName = {
	"nombre 1": inputPlayer1.value,
	"nombre 2": inputPlayer2.value,
};

// este boton guarda la partida en el localstorage
botonGuardarPartida.addEventListener("click", function () {
	guardarPartida();
});

// esta funcion almacena y recupera la info en el localstorage
function guardarPartida() {
	let partidasGuardadas = [];
	let usuariosGuardados = [];
	let listaJugadores = [];
	let listaData = [];

	saveLocalStorage("nombre", getName);
	saveLocalStorage("partidas", getData);
	if (getLocalStorage("partidas")) {
		partidasGuardadas = getLocalStorage("partidas");
		console.log(partidasGuardadas);
	}
	if (getLocalStorage("nombre")) {
		usuariosGuardados = getLocalStorage("nombre");
		console.log(usuariosGuardados);
	}

	for (let nombres in getName) {
		console.log(getName[nombres]);
		listaJugadores.push(getName[nombres]);
	}
	for (let data in getData) {
		console.log(getData[data]);
		listaData.push(getData[data]);
	}

	console.log(listaJugadores);
	console.log(listaData);

	crearModelo(listaJugadores, listaData);
}

let contadorPartidas = 0;
// esta funcion crea el modelo que se inserta en la ul del html en jugadas anteriores
function crearModelo(listaJugadores, listaData) {
	let modelo = `<li>${listaJugadores.join(" y ")}<span class="mb-0 ms-4">${listaData.join(
		" - "
	)}</span></li>`;

	if (contadorPartidas === 0) {
		listaJugadasPrevias.innerHTML += modelo;
	} else if (contadorPartidas > 0) {
		listaJugadasPrevias.lastElementChild.innerHTML = modelo;
	}
	++contadorPartidas;
}
