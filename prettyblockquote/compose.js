// code adapted from Thunderbird CustomCSS extension by Grant
let bs = document.body.style;
let isHTML = !((bs.whiteSpace === 'pre-wrap') && (bs.fontFamily === 'monospace'));

if (isHTML) {
	let style_elements = document.getElementsByTagName('blockquote');

	function setPrettyQuotes(result) {
		console.log(result);
		
		if(style_elements.length > 0) {
			style_elements[0].style.margin = '0px 0px 0px ' + (result.custom_margin ? result.custom_margin : '1ex');
			style_elements[0].style.borderLeft = (result.custom_width ? result.custom_width : '2px') +' solid ' + (result.custom_color ? result.custom_color : 'rgb(114,159,207)');
			style_elements[0].style.paddingLeft = (result.custom_padding ? result.custom_padding : '1ex');
		}
	}
	
	function onError(error) {
		console.log('Error: ' + error);
	}
	
	let getPromise = browser.storage.local.get(['custom_margin', 'custom_width', 'custom_color', 'custom_padding']);
	getPromise.then(setPrettyQuotes, onError);
}
