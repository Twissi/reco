(function () {
  "use strict";

  console.log("### Run background.js")

  // listen to messages from the content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.task == 'ebaySearch') {
        var searchString = message.string;

        ebaySearch(searchString, function(response){
          sendResponse({task: message.task, content: response});
        });

    } else if (message && message.task == 'dawandaSearch') {
      var searchString = message.string;

      dawandaSearch(searchString, function(response){
        sendResponse({task: message.task, content: response});
      });
    } else if (message && message.task == 'showPageAction') {
      // show page action
      chrome.pageAction.show(sender.tab.id);
    }
    return true;
  });

  function ebaySearch(searchString, callback) {
    var url = "https://www.ebay-kleinanzeigen.de/s-" + searchString + "/k0";
    console.log(url);
    httpGet(url, function(response){
      callback(response);
    });
  }

  function dawandaSearch(searchString, callback) {
    var url = "https://de.dawanda.com/srch?q=" + searchString;
    console.log(url);
    httpGet(url, function(response){
      callback(response);
    });
  }

  function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }



})();