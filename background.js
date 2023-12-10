const browserObject = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null

let stylesEnabled = true

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.toggleStyles !== undefined) {
		stylesEnabled = request.toggleStyles
		chrome.tabs.query({}, function (tabs) {
			tabs.forEach(function (tab) {
				chrome.tabs.sendMessage(tab.id, { stylesEnabled })
			})
		})
	}
})
