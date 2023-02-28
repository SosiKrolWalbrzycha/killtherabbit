const btn = document.querySelector('.welcome__btn')
const welcome = document.querySelector('.welcome')
const screenHeight = document.documentElement.clientHeight
const screenWidth = document.documentElement.clientWidth
const screen = document.querySelector('body')
const zero = 0
const ammoMagazine = document.querySelector('.ammo')
const magazine = document.querySelector('.ammo-visible')
const scoreArea = document.querySelector('.score')

let timeout
let balls // liczba celów
let attempts = 0
let maxattempts = 5 // liczba prób maksymalna
let height // ustaiwenie celu na Ykach
let width // ustaiwenie celu na Xach
let hbullet = 0 // wysokośc magazynku z kulami
let scoreAttept = 0
let shootpositionXArray = [1]
let shootpositionYArray = [1]
let rabbitpositionXArray = [1]
let rabbitpositionYArray = [1]
let tarcza
let btnTopPosition
let btnLeftPosition
let heightShootUp
let heightShootDown
let widthShootLeft
let widthShootRight
let shootScore
let circle

//F1 Wyłączenie okna startowego

const welcomeCancel = () => {
	hbullet = 0
	welcome.style.display = 'none'
	ammoMagazine.style.display = 'flex'
	ammoMagazine.style.backgroundImage = ''
}

//F2 Losowanie pozycji celów

const budTarcza = () => {
	tarcza = document.createElement('div')
	tarcza.classList.add('tarcza')
	screen.appendChild(tarcza)
	tarcza.addEventListener('click', shoot)
}

const destTarcza = () => {
	tarcza.remove()
}

const lottery = () => {
	if (attempts < maxattempts) {
		attempts++

		const dlt = () => {
			circle.remove()
		}

		height = Math.floor(Math.random() * ([screenHeight - 80] - 0) + 0)
		width = Math.floor(Math.random() * ([screenWidth - 80] - 0) + 0)

		circle = document.createElement('div')
		circle.classList.add('circle')
		circle.classList.add(`attempt`)
		circle.style.top = `${height}px`
		circle.style.left = `${width}px`
		screen.appendChild(circle)
		console.log(`próba nr ${attempts}`)
		setTimeout(dlt, 1000)
	} else {
		
		welcome.style.display = 'flex'
		ammoMagazine.style.display = 'none'
		attempts = 0
		destTarcza()
	}
}
//PUNKTACJA
const score = () => {
	shootpositionXArray.push(btnLeftPosition)
	shootpositionYArray.push(btnTopPosition)
	rabbitpositionXArray.push(widthShootLeft)
	rabbitpositionYArray.push(heightShootUp)

	console.log(shootpositionXArray)
	console.log(shootpositionYArray)

	console.log(rabbitpositionXArray)
	console.log(rabbitpositionYArray)
}

const scoreDisplay = () => {
	scoreArea.style.display = 'flex'
	shootScore = document.createElement('div')
	shootScore.classList.add('shotscore')
	const xScore = rabbitpositionXArray[scoreAttept] - shootpositionXArray[scoreAttept]
	const yScore = rabbitpositionYArray[scoreAttept] - shootpositionYArray[scoreAttept]

	console.log(xScore)
	console.log(yScore)

	if (xScore >= -60 && xScore <= -20 && yScore >= -60 && yScore <= -20) {
		shootScore.textContent = `Kóla numer ${scoreAttept} zabiła królika`
		scoreArea.appendChild(shootScore)
	} else if (
		((xScore >= -80 && xScore < -60) || (xScore <= 0 && xScore > -20)) &&
		((yScore >= -80 && yScore < -60) || (yScore <= 0 && yScore > -20))
	) {
		shootScore.textContent = `Kóla numer ${scoreAttept} raniła królika`
		scoreArea.appendChild(shootScore)
	} else {
		shootScore.textContent = `Kóla numer ${scoreAttept} nie osiągnęła celu`
		scoreArea.appendChild(shootScore)
	}
}

//STRZELANIE

const shoot = e => {


//pozycjonowanie 

	btnTopPosition = e.clientY
	btnLeftPosition = e.clientX
	heightShootUp = height
	heightShootDown = height + 80
	widthShootLeft = width
	widthShootRight = width + 80
	hbullet = hbullet + 50
	scoreAttept = scoreAttept + 1

	if (hbullet <= 250) {
		magazine.style.top = `${hbullet}px`
		score()
		scoreDisplay()

		console.log(
			`Kliknięcie ${btnTopPosition}y ${btnLeftPosition}x, Koordynaty celu: ${heightShootUp}minY ${heightShootDown}maxY na ${widthShootLeft}minX ${widthShootRight}maxX`
		)

		//Sprawdzanie celności

		if (
			btnTopPosition > heightShootUp &&
			btnTopPosition < heightShootDown &&
			btnLeftPosition > widthShootLeft &&
			btnLeftPosition < widthShootRight
		) {
			const aim = document.querySelector('.attempt')
			aim.style.backgroundImage = 'url(dist/img/dead.png)'
			aim.style.border = '3px solid #ff0000'
		}
	} else {
		ammoMagazine.style.backgroundImage = 'url(dist/img/out_of_ammo.png)'
	}

	//dzwiek strzalu

	if (scoreAttept <= 5) {var snd = new Audio("dist/img/12-Gauge-Pump-Action-Shotgun-Close-Gunshot-B-www.fesliyanstudios.com.mp3");
	var snd1 = new Audio('dist/img/Rifle-Reload-Foley-B-www.fesliyanstudios.com.mp3');
	snd.loop = false;
	snd.autoplay = false;
	snd.play()
	snd1.loop = false;
	snd1.autoplay = false;
	snd1.play()
}

}

const ballsMovement = () => {
	scoreAttept = 0
	welcomeCancel()
	budTarcza()
	while (scoreArea.firstChild) {
		scoreArea.firstChild.remove()
	}

shootpositionXArray.splice(1,5)
shootpositionYArray.splice(1,5)
rabbitpositionXArray.splice(1,5)
rabbitpositionYArray.splice(1,5)

	magazine.style.top = `0px`
	const setInt = setInterval(lottery, 3000)
	const cancelInterval = () => {
		clearInterval(setInt)
	}
	setTimeout(cancelInterval, 19001)
}

btn.addEventListener('click', ballsMovement)