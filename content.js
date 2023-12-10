const browserObject = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null

const addActionsToDrawings = async () => {
	// if there are no drawings, wait another 3 seconds and try again
	if (!document.querySelectorAll('.waffle-borderless-embedded-object-overlay').length) {
		await new Promise((resolve) => setTimeout(resolve, 3000))
	}

	const drawings = document.querySelectorAll('.waffle-borderless-embedded-object-overlay')
	drawings.forEach((drawing) => drawing.addEventListener('click', onDrawingClick))
}

const initTabChangeEvent = () => {
	// when the tab changes, a specific container is removed and re-added
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.removedNodes.length) {
				console.log('tab changed')
				onTabChange()
			}
		})
	})

	observer.observe(document.querySelector('#docs-editor #waffle-grid-container'), {
		childList: true,
		subtree: false,
	})
}

const onTabChange = () => {
	addActionsToDrawings()
}

const onDrawingClick = (e) => {
	const drawing = e.currentTarget

	// sounds from https://soundbible.com/tags-rolling-dice.html
	const allSounds = ['audio/dice1.mp3', 'audio/dice2.mp3', 'audio/dice-redneck.mp3']

	// if the aria-label contains the right value
	if (drawing.getAttribute('aria-label').toLowerCase().includes('würfel')) {
		// play a random sound. make dic1 and dice2 evenly likely (50% each) and dice-redneck less likely (5%)
		const random = Math.random()
		if (random < 0.5) {
			playAudio(allSounds[0])
		} else if (random < 0.95) {
			playAudio(allSounds[1])
		} else {
			playAudio(allSounds[2])
		}

		animateDice(drawing)
	}
}

const animateDice = (element) => {
	element.style.transform = 'translateX(-10px) rotate(-5deg)'
	element.style.transition = 'transform 0.1s ease-in-out'
	setTimeout(() => {
		element.style.transform = 'translateX(10px) rotate(5deg)'
	}, 100)
	setTimeout(() => {
		element.style.transform = 'translateX(-10px) rotate(-5deg)'
	}, 200)
	setTimeout(() => {
		// reset the transform
		element.style.transform = ''
	}, 300)
}

const getRuntimeURL = (file) => {
	if (!browserObject) return file

	return browserObject.runtime.getURL(file)
}

const playAudio = (file) => {
	console.log('playing audio', file)

	const audio = new Audio(getRuntimeURL(file))
	audio.play()
}

const init = async () => {
	// wait some time until the drawings are loaded
	await new Promise((resolve) => setTimeout(resolve, 5000))

	addActionsToDrawings()
	initTabChangeEvent()
}

init()
