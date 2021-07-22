let pantallaCarga = document.getElementById("pantallaCarga");
let pantallaJuego = document.getElementById("pantallaJuego");

let inputPlayer1 = document.getElementById("inputJugador1");
let inputPlayer2 = document.getElementById("inputJugador2");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let inputHelp1 = document.getElementById("inputHelp1");
let inputHelp2 = document.getElementById("inputHelp2");
let inputHelpBlock1 = document.getElementById("inputHelpBlock1");
let inputHelpBlock2 = document.getElementById("inputHelpBlock2");
let maxlength = 12;

let playerScore1 = document.getElementById("player1Score");
let playerScore2 = document.getElementById("player2Score");

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
	if ((!inputPlayer1.value || inputPlayer1.value.length === 0 || /^\s*$/.test(inputPlayer1.value)) && (!inputPlayer2.value || inputPlayer2.value.length === 0 || /^\s*$/.test(inputPlayer2.value) )) {
		inputHelp1.style.display = "block";
		inputHelp2.style.display = "block";
	} else if (!inputPlayer1.value || inputPlayer1.value.length === 0 || /^\s*$/.test(inputPlayer1.value)) {
		inputHelp1.style.display = "block";
	} else if (!inputPlayer2.value || inputPlayer2.value.length === 0 || /^\s*$/.test(inputPlayer2.value)) {
		inputHelp2.style.display = "block";
	} else if (
		inputPlayer1.value.length > maxlength &&
		inputPlayer2.value.length > maxlength
	) {
		inputHelpBlock1.style.display = "block";
		inputHelpBlock2.style.display = "block";
		inputHelp1.style.display = "none";
		inputHelp2.style.display = "none";
	} else if (inputPlayer1.value.length > maxlength) {
		inputHelpBlock1.style.display = "block";
		inputHelp1.style.display = "none";
	} else if (inputPlayer2.value.length > maxlength) {
		inputHelpBlock2.style.display = "block";
		inputHelp2.style.display = "none";
	} else {
		llamarApi();
		getName.nombre1 = inputPlayer1.value;
		getName.nombre2 = inputPlayer2.value;
		pantallaCarga.style.display = "none";
		pantallaJuego.style.display = "block";
		fadeIn(limpiarTableroBtn);
		fadeIn(reiniciarJuegoBtn);
		fadeInFlex(grillaJuego);
		fadeInFlex(player1Container);
		fadeInFlex(player2Container);
	}
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
				getData.dataScoreTotalPlayer1 = turnoJugador(
					jugadasPlayer1,
					slot,
					inputPlayer1,
					resultado,
					// scorePartidaPlayer1,
					playerScore1,
					getData.dataScoreTotalPlayer1
				);
			} else if (slot.slotClicked) {
				console.log("pinta otro");
			}
		} else if (contadorJugadas % 2 === 1) {
			if (!slot.slotClicked) {
				slot.pintarCeleste();
				getData.dataScoreTotalPlayer2 = turnoJugador(
					jugadasPlayer2,
					slot,
					inputPlayer2,
					resultado,
					// scorePartidaPlayer2,
					playerScore2,
					getData.dataScoreTotalPlayer2
				);
			} else if (slot.slotClicked) {
				console.log("pinta otro");
			}
		}
	} else if (ganador) {
		console.log("entro al if del slots");
	}
}

//esta funcion realiza el proceso interno de cada turno de cada jugador
function turnoJugador(
	jugadasPlayer,
	slot,
	inputPlayer,
	resultado,
	// scorePartidaPlayer,
	playerScore,
	dataScoreTotalPlayer
) {
	jugadasPlayer.push(slot.slotId);
	console.log(jugadasPlayer);
	resultado = busqueda(posicionesGanadoras, jugadasPlayer);
	slot.slotClicked = true;
	contadorJugadas++;
	if (resultado) {
		ganador = true;
		// scorePartidaPlayer++;
		// console.log(scorePartidaPlayer);
		dataScoreTotalPlayer = ++dataScoreTotalPlayer; // actualiza el valor de la key en la posicion de memoria
		updateScore(playerScore, dataScoreTotalPlayer);
		console.log("gano player 1");
		modalTexto.innerText = `¡Felicitaciones ${inputPlayer.value}, ganaste esta partida!`;
		myModal.show();
	} else if (!ganador && contadorJugadas === 9) {
		console.log("Es un empate");
		modalTexto.innerText = `Esta vez no gano nadie, es un empate`;
		myModal.show();
	}
	return dataScoreTotalPlayer;
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
	clearScore(playerScore1);
	clearScore(playerScore2);
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
	getData.dataScoreTotalPlayer1 = 0;
	getData.dataScoreTotalPlayer2 = 0;
}

// esta funcion limpia la posicion de memoria de los nombres
function clearGetName() {
	getName.nombre1 = "";
	getName.nombre2 = "";
}

//esta funcion reinicia los valores para reiniciar el juego
function reiniciarJuego() {
	inputPlayer1.value = "";
	inputPlayer2.value = "";
	/*scorePartidaPlayer1 = 0;
	scorePartidaPlayer2 = 0;*/
	contadorPartidas = 0;
	removerFotoPLayer1()
	removerFotoPLayer2()
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
	dataScoreTotalPlayer1: 0,
	dataScoreTotalPlayer2: 0,
};
let getName = {
	nombre1: inputPlayer1.value,
	nombre2: inputPlayer2.value,
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

// JQUERY
$(document).ready(function () {
	entranceLeft(seccionIzquierda);
	entranceRight(seccionDerecha);
});

//efecto de entrada de la izquierda
const seccionIzquierda = $(".section-left");
function entranceLeft(selector) {
	if ($(selector).hasClass("invisible-left")) {
		$(selector).animate({left: "0px"}, 1500).removeClass("invisible-left");
	} else {
		$(selector).animate({left: "-1000px"}, 1500).addClass("visible-left");
	}
}

//efecto de entrada de la derecha
const seccionDerecha = $(".section-right");
function entranceRight(selector) {
	if ($(selector).hasClass("invisible-right")) {
		$(selector).animate({right: "0px"}, 1500).removeClass("invisible-right");
	} else {
		$(selector).animate({right: "-1000px"}, 1500).addClass("invisible-right");
	}
}

// efecto de fade in
const limpiarTableroBtn = $("#botonLimpiar");
const reiniciarJuegoBtn = $("#botonReiniciarJuego");
function fadeIn(selector) {
	console.log("fadein");
	$(selector).fadeIn(1500);
}

// efecto de fade in con clase de flex luego del efecto
const grillaJuego = $("#grilla");
const player1Container = $("#player1Container");
const player2Container = $("#player2Container");
function fadeInFlex(selector) {
	console.log("fadein");
	$(selector).animate({opacity: "1"}, 1500).addClass("flex");
}

// ajax request api random user
function llamarApi(){ $.ajax({
	url: "https://randomuser.me/api/?results=2",
	dataType: "json",
	success: function (data) {
		console.log(data);
		agregarFotoPlayer1(data);
		agregarFotoPlayer2(data);
	},
})};

// agregar foto segun peticion api a jugador 1
function agregarFotoPlayer1(data) {
	$("#player1Container").prepend(
		`<img src="${data.results[0].picture.thumbnail}" class="me-3" id="img1"></img>`
	);
}

// agregar foto segun peticion api a jugador 2
function agregarFotoPlayer2(data) {
	$("#player2Container").prepend(
		`<img src="${data.results[1].picture.thumbnail}" class="me-3" id="img2"></img>`
	);
}

function removerFotoPLayer1(){
	$("#img1").remove()
}

function removerFotoPLayer2(){
	$("#img2").remove()
}