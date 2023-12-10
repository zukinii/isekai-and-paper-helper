const browserObject = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null

document.addEventListener('DOMContentLoaded', function () {
	const styleToggle = document.querySelector('#style-toggle')

	styleToggle.addEventListener('change', function () {
		chrome.runtime.sendMessage({ toggleStyles: styleToggle.checked })
	})
})
