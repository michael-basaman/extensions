chrome.webNavigation.onHistoryStateUpdated.addListener(async function (details) {
	if (typeof window !== "undefined") {
		window.addEventListener("popstate", function(e) {
			    history.back();
			}, false);	
	}	
});
