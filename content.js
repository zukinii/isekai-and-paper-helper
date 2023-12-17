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
	const ariaLabel = drawing.getAttribute('aria-label').toLowerCase()

	// if the aria-label contains the right value
	if (ariaLabel.includes('würfel')) {
		makeDiceSound()
		animateDice(drawing)
	}
	if (ariaLabel.includes('pfeil-rauf')) {
		playAudio('tap.wav')
		animateArrowUp(drawing)
	}
	if (ariaLabel.includes('pfeil-runter')) {
		playAudio('tap.wav')
		animateArrowDown(drawing)
	}
}

const makeDiceSound = () => {
	playAudio('rattling.mp3', 1.5)
	setTimeout(() => {
		playAudio('clatter.mp3')
	}, 1000)
}

const animateDice = (element) => {
	// animate the dice
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

const animateArrowUp = (element) => {
	// make it grow and fade out and then return to normal, but really fast to make it subtle
	element.style.transition = 'transform 0.1s ease-in-out, opacity 0.1s ease-in-out'
	setTimeout(() => {
		element.style.transform = 'scale(1.1)'
		element.style.opacity = 0.5
	}, 100)
	setTimeout(() => {
		element.style.transform = ''
		element.style.opacity = 1
	}, 200)
}

const animateArrowDown = (element) => {
	// the same as arrow up, but shrink instead of grow
	element.style.transition = 'transform 0.1s ease-in-out, opacity 0.1s ease-in-out'
	setTimeout(() => {
		element.style.transform = 'scale(0.9)'
		element.style.opacity = 0.5
	}, 100)
	setTimeout(() => {
		element.style.transform = ''
		element.style.opacity = 1
	}, 200)
}

const getRuntimeURL = (file) => {
	if (!browserObject) return file

	return browserObject.runtime.getURL(file)
}

const playAudio = (name, speed = 1) => {
	console.log('playing audio', name)

	const file = `audio/${name}`

	const audio = new Audio(getRuntimeURL(file))
	audio.playbackRate = speed
	audio.play()
}

const toggleStyles = () => {
	const style = document.querySelector('#style')
	if (!style) return

	if (style.disabled) {
		style.disabled = false
	} else {
		style.disabled = true
	}
}

const listenForMessages = () => {
	console.log('listening for messages')
	browserObject.runtime.onMessage.addListener((request) => {
		console.log('message received', request)
		if (request.toggleStyles) {
			toggleStyles()
		}

		return Promise.resolve({ status: 'ok' })
	})
}

const init = async () => {
	// wait some time until the drawings are loaded
	await new Promise((resolve) => setTimeout(resolve, 5000))

	addActionsToDrawings()
	initTabChangeEvent()
	listenForMessages()
}

init()
