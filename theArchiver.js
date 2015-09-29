// Simple Chrome Extension to make it easier to Save Webpages or Check if they have been saved previously
// uses Archive.org's Wayback Machine, Archive.is and Webcite
// Cathal McNally
// 19.06.2015
// ver 1.1

// changelog
// ver 1.0 Initial version
// ver 1.1 fixed a url error for settings page

(function(){
	// Get settings saved in local storage
	var archive_org = localStorage["thearchiver_archiveorg"];
	var archive_is = localStorage["thearchiver_archiveis"];
	var webcite = localStorage["thearchiver_webcite"];
	var email = localStorage["thearchiver_email"];	
	var firstRun = localStorage["thearchiver_firstRun"];
	
	// Dirty but it works
	// Check if firstRun doesnt exist, If so populate variables
	if(firstRun == undefined){
		// No need to check each, archive.org will do
		if (archive_org == undefined){
			archive_org = "true";
			archive_is = "true";
			webcite = "true";
			email = "Your E-Mail";
			
			// turn firstRun off
			firstRun = 0;
			
			// lets set the local Storage so the options Dialog is setup correctly on first run
			localStorage["thearchiver_archiveorg"] = archive_org;
			localStorage["thearchiver_archiveis"] = archive_is;
			localStorage["thearchiver_webcite"] = webcite;
			localStorage["thearchiver_email"] = email;
		}
	}
	
	// Depending on the options you have set send the currently opened page to an Archival Service
	function saveIt(info){
		var linkClicked = "";
		if (info.linkUrl){
			linkClicked = info.linkUrl;
		} else if (info.mediaType === "image"){
			linkClicked = info.srcUrl;
		} else{
			linkClicked = info.pageUrl;
		} 
		// Save with the Wayback Machine
		if(archive_org == "true"){
			chrome.tabs.create({ 
				url: "http://web.archive.org/save/" + linkClicked,
			});
		}
		
		// Save with Archive.is
		if(archive_is == "true"){
			chrome.tabs.create({ 
				url: "https://archive.is/?run=1&url=" + linkClicked,
			});
		}
		
		// Save with WebCite
		if(webcite == "true"){
			chrome.tabs.create({ 
				url: "http://www.webcitation.org/archive?url=" + linkClicked + "&email=" + email,
			});
		}
	}

	// Check if any of the Archival services have saved the page already
	function checkIt(info){
		var linkClicked = "";
		if (info.linkUrl){
			linkClicked = info.linkUrl;
		} else if (info.mediaType === "image"){
			linkClicked = info.srcUrl;
		}else{
			linkClicked = info.pageUrl;
		}
		// Check the Wayback Machine
		if(archive_org == "true"){
			chrome.tabs.create({
				url: "http://web.archive.org/web/" + linkClicked,
			});
		}
		
		// Check Archive.is
		if(archive_is == "true"){
			chrome.tabs.create({
				url: "http://archive.is/" + linkClicked,			
			});
		}
		
		// Check WebCite
		if(webcite == "true"){
			chrome.tabs.create({
				url: "http://www.webcitation.org/query?url=" + linkClicked,
			});
		}
	}

	// Open settings
	function goToSettings(){
		chrome.tabs.create({ 
		url: "/options/options.html",
	  });
	}
	
	// Create context menus
	chrome.contextMenus.create({
	  "title": "Save It",
	  "contexts": ["page", "link", "image"],
	  "onclick": saveIt}
	);

	chrome.contextMenus.create({
	  "title": "Check It",
	  "contexts": ["page", "link", "image"],
	  "onclick": checkIt}
	);

	chrome.contextMenus.create({
	  "title": "Settings",
	  "contexts": ["page", "link", "image"],
	  "onclick": goToSettings}
	);
}());