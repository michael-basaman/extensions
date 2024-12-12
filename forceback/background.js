let url_map = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(typeof tabId != "undefined"
			&& typeof changeInfo != "undefined"
		 	&& typeof changeInfo.status != "undefined"
			&& changeInfo.status == "loading"
			&& tab != "undefined"
			&& tab.url != "undefined") {
		let millis = Date.now();
		
		if(url_map.has(tabId)) {
			let last_url = url_map.get(tabId);
			
			if(last_url == tab.url) {
				setTimeout(() => {
					chrome.history.deleteRange({
						endTime: millis + 10,
						startTime: millis - 100
					}, () => {
						return true;
					});	
				}, 500);
			} else {
				url_map.set(tabId, tab.url);	
			}
		} else {
			url_map.set(tabId, tab.url);
		}
	}	
	
	return true;
});
