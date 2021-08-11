// ----------------------------
// VARIABLES
// ----------------------------
// la durée du jeu = 1mn et score = 0
let duration = 60;
const timer = document.querySelector(".timer");
let score = 0;
const displayScore = document.querySelector(".score");
// phrase aléatoire à copier
const textToCopy = document.querySelector(".text-to-copy");
// span des lettre du texte à copier
const span = document.querySelector("span");
// le texte que je tape
const myCurrentText = document.querySelector("#my-text");
// bouton play
const play = document.querySelector(".play");
let caracArray = [];
// variable API apiquotable.io
const APICALL = "https://api.quotable.io/random?minLength=5&maxLength=30";
let countdown;

// ----------------------------
// FONCTIONS
// ----------------------------

// 1 - récupérer la phrase aléatoire depuis l'api
// function randomTextApi() {
// 	fetch(APICALL)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			console.log(data.content, data.length);
// 			textToCopy.innerText = data.content;
// 		});
// }

// alternative async / await
async function textApi() {
	const callAPI = await fetch(APICALL);
	let randomText = await callAPI.json();
	// textToCopy.innerText = randomText.content;

	// la phrase récupérée va être splittée en array pour la suite et chaque lettre mise dans un span
	randomText.content.split("").forEach((car) => {
		let spanCarac = document.createElement("span");
		spanCarac.innerText = car;
		textToCopy.appendChild(spanCarac);
		caracArray.push(spanCarac);
		myCurrentText.value = null;
	});
	// console.log(textToCopy);
	// console.log(caracArray);
}
// -----------------------------
// 2 - démarrer la partie
function startGame() {
	reset();
	displayScore.innerText = `Score : ${score}`;
	countdown = setInterval(initTimerScore, 1000);
	initTimerScore();
	textApi();
}

// -----------------------------
// 3 - animation label
function moveLabel() {
	if (this.value !== "") {
		this.parentNode.classList.add("active");
	} else {
		this.parentNode.classList.remove("active");
	}

	// fonction n° 5 appelée ici car gérée également par le
	// addEventListener 'input'
	writingMyText();
}

// -----------------------------
// 4 - actualisation timer et score => utilisée dans le setInterval countdown
// de la fonction startGame étape 2
function initTimerScore() {
	play.disabled = true;
	duration--;
	timer.innerText = "Temps de jeu = 00" + ":" + duration + "s";
	displayScore.innerText = `Score = ${score}`;
	if (duration === 0) {
		clearInterval(countdown);
		caracArray = [];
		textToCopy.innerText = "";
		myCurrentText.value = "";
		myCurrentText.disabled = true;
		myCurrentText.parentNode.classList.remove("active");
		play.disabled = false;
	}
}

// -----------------------------
// 5 - Phase de jeu
// console.log(caracArray); // tableau des span
function writingMyText() {
	const lettersMyCurrentText = myCurrentText.value.split("");

	// booleen qui permet de gérer le score et le lancement d'un nouveau texte
	let correct = true;

	// avec foreach on peut récupérer valeur et index
	caracArray.forEach((caracSpan, index) => {
		// console.log(caracSpan); // va afficher tous les caractères de la phrase
		const carac = lettersMyCurrentText[index];
		// pour éviter que tout le texte à copier vire au rouge dès le début
		// les lettres du texte à copier pas encore tapées ont par défaut une valeur undefined
		// quand elles sont comparées avec ce que l'on tape
		if (carac === undefined) {
			caracSpan.classList.remove("error");
			caracSpan.classList.remove("success");
			correct = false;
		} else if (carac === caracSpan.innerText) {
			caracSpan.classList.remove("error");
			caracSpan.classList.add("success");
		} else if (carac !== caracSpan.innerText) {
			caracSpan.classList.remove("success");
			caracSpan.classList.add("error");
			correct = false;
		}
	});

	// quand on a terminé la première phrase on enchaîne avec une nouvelle
	// tant que le timer n'est pas à 0
	if (correct === true && duration > 0) {
		caracArray = [];
		textToCopy.innerText = "";
		myCurrentText.value = "";
		textApi();
		score++;
		displayScore.innerText = `Score = ${score}`;
	}
}

// 6 - reset
function reset() {
	myCurrentText.disabled = false;
	duration = 60;
	score = 0;
	caracArray = [];
}
// ----------------------------
// LISTENERS
// ----------------------------

// 1 - animation label
myCurrentText.addEventListener("input", moveLabel);
// 2 - début partie
play.addEventListener("click", startGame);

// ----------------------------
// MAIN
// ----------------------------

// initialisation du timer à 1mn à l'   arrivée sur la page avant le démarrage de la partie
timer.innerText = "Temps de jeu = 01:00mn";
// init du score à l'arrivée dur la page
displayScore.innerText = `Score = ${score}`;
