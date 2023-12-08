document.addEventListener('DOMContentLoaded', function () {
	const styleToggle = document.querySelector('#style-toggle')

	styleToggle.addEventListener('change', function () {
		chrome.runtime.sendMessage({ toggleStyles: styleToggle.checked })
	})
})
