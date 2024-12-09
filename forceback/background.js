let url_map = new Map();
let redirect_map = new Map();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	console.log("onUpdated(" + tabId + ", " + tab.url);
	
	if(typeof tabId != "undefined"
			&& tab != "undefined"
			&& tab.url != "undefined") {
		console.log("onUpdated(" + tabId + ", " + tab.url);
		
		if(url_map.has(tabId)) {
			let last_url = url_map.get(tabId);
			
			if(last_url != tab.url) {
				console.log("New url: " + tab.url);
				
				redirect_map.set(tabId, 0);
				url_map.set(tabId, tab.url);			
			}
		}
	}
	
	return true;
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
	if(typeof tabId != "undefined") {
		url_map.delete(tabId);
		redirect_map.delete(tabId);	
	}	
	
	return true;
});

chrome.history.onVisited.addListener(async (result) => {
	let url = result.url;
	let lastVisitTime = result.lastVisitTime;
	
	console.log()
	return true;
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
	var a = true;
	if(a) {
		return true;	
	}	

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
				
				console.log("client_redirect, setting redirect_count to " + redirect_map.get(details.tabId) + " for tab " + details.tabId);
			}
		}
	}
	
	return true;
});
