// Function to get the browser object
export const getBrowserObject = () => {
	if (typeof chrome !== 'undefined') {
		return chrome.runtime
	} else if (typeof browser !== 'undefined') {
		return browser.runtime
	} else {
		// Handle other cases or provide a default value
		return null
	}
}
