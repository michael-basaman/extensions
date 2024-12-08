function saveOptions(e) {
    e.preventDefault();
    let custom_margin = document.querySelector("#custom_margin").value;
	let custom_width = document.querySelector("#custom_width").value;
	let custom_color = document.querySelector("#custom_color").value;
	let custom_padding = document.querySelector("#custom_padding").value;
	
    browser.storage.local.set({
		custom_margin: custom_margin,
		custom_width: custom_width,
		custom_color: custom_color,
		custom_padding: custom_padding});
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#custom_margin").value = result.custom_margin || '';
		document.querySelector("#custom_width").value = result.custom_width || '';
		document.querySelector("#custom_color").value = result.custom_color || '';
		document.querySelector("#custom_padding").value = result.custom_padding || '';
    }
    
	function onError(error) {
		console.log('Options Error: ' + error);
	}
		
	let getPromise = browser.storage.local.get(['custom_margin', 'custom_width', 'custom_color', 'custom_padding']);
	getPromise.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
