let url_map = new Map();
let redirect_map = new Map();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if(typeof tabId != "undefined"
			&& typeof changeInfo != "undefined"
		 	&& typeof changeInfo.status != "undefined"
			&& changeInfo.status == "loading"
			&& tab != "undefined"
			&& tab.url != "undefined") {
		if(url_map.has(tabId)) {
			let last_url = url_map.get(tabId);
			
			if(last_url != tab.url) {
				console.log("tabs.onUpdated(" + tabId + ") - " + tab.url);
				
				redirect_map.set(tabId, 0);
				url_map.set(tabId, tab.url);			
			}
		} else {
			console.log("tabs.onUpdated(" + tabId + ") - " + tab.url);
			url_map.set(tabId, tab.url);
			redirect_map.set(tabId, 0);
		}
	}	
	
	return true;
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
	if(typeof tabId != "undefined") {
		console.log("tabs.onRemoved(" + tabId + ")");
		
		if(url_map.has(tabId)) {
			url_map.delete(tabId);
		}
		
		if(redirect_map.has(tabId)) {
			redirect_map.delete(tabId);
		}			
	}	
	
	return true;
});

chrome.history.onVisited.addListener(async (result) => {
	if(typeof result != "undefined"
			&& typeof result.url != "undefined") {
		let url = result.url;
		
		chrome.tabs.getCurrent(async (tab) => {
			if(typeof tab != "undefined"
					&& typeof tab.id != "undefined") {
				console.log("history.onVisited(" + tab.id + ") visited " + result.url);			
			}
		});
	}
	
	
	
	return true;
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
	if (typeof details !== "undefined"
			&& typeof details.tabId !== "undefined"
			&& typeof details.transitionQualifiers !== "undefined"
			&& Array.isArray(details.transitionQualifiers)) {
		for(let i = 0; i < details.transitionQualifiers.length; i++) {
			if(details.transitionQualifiers[i] == "client_redirect") {
				if(redirect_map.has(details.tabId)) {
					redirect_map.set(details.tabId, redirect_map.get(details.tabId) + 1);
				} else {
					redirect_map.set(details.tabId, 1);
				}
				
				console.log("webNavigation.onHistoryStateUpdated(" + details.tabId + ") - redirect " + redirect_map.get(details.tabId));
			}
		}
	}
	
	return true;
});
