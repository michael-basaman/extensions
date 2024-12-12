let url_map = new Map();

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if(typeof tabId != "undefined"
            && url_map.has(tabId)) {
        url_map.delete(tabId);                
    }
});

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
					chrome.history.search({
						endTime: millis + 1000,
						startTime: millis - 100,
						text: ""
					}).then((results) => {
						if(typeof results != "undefined"
								&& Array.isArray(results)) {
							for(let i = 0; i < results.length; i++) {
								let historyItem = results[i];
								
								if(typeof historyItem != "undefined"
										&& typeof historyItem.lastVisitTime != "undefined"
										&& typeof historyItem.url != "undefined"
										&& historyItem.url == last_url) {
									chrome.history.deleteRange({
										endTime: historyItem.lastVisitTime + 1,
										startTime: historyItem.lastVisitTime - 1
									}).then(() => {
										// console.log("ForceBack chrome.history.deleteRange(" + millis + ", " + historyItem.lastVisitTime + ") - " + tab.url);
									});		
								}
							}			
						}
					});
				}, 1000);
			} else {
				url_map.set(tabId, tab.url);	
			}
		} else {
			url_map.set(tabId, tab.url);
		}
	}
});
