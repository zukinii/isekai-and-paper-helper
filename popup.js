const browserObject = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null

const styleToggle = document.querySelector('#styletoggle')

console.log('popup.js loaded', styleToggle)

styleToggle?.addEventListener('change', async () => {
	console.log('style toggle changed')

	browserObject.runtime.sendMessage({ toggleStyles: styleToggle.checked })
})

// TODO: find out how to send and receive messages from the content script so we can toggle options
