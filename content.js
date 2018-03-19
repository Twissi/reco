(function () {
  "use strict";

  console.log("### Run content.js")

  // amazon input selector
  const inputField = $('form.nav-searchbar input[type="text"]#twotabsearchtextbox');
  // amazon submit button selector
  const submitButton = $('form.nav-searchbar input[type="submit"]');
  var searchString = "";
  var popupContent = {"ebaySearch": [], "dawandaSearch" : []};

  // run search when page loads
  searchForAlternatives();

  // event listener for amazon search submit button
  submitButton.on("click", searchForAlternatives);

  function searchForAlternatives() {
    var validInput = inputField.length !== 0 && inputField.val() !== "";

    if( validInput && searchString !== inputField.val() ) {
      console.log("Found new search string: " + inputField.val());
      // reset popup content
      popupContent = {"ebaySearch": [], "dawandaSearch" : []}
      searchString = inputField.val();
      triggerDawandaSearch(searchString);
      triggerEbaySearch(searchString);
    }
  }

  // ebay search
  function triggerEbaySearch(searchString) {
    console.log("Run ebay search")
    sendMessageToBackgroundScript({'task': 'ebaySearch', "string": searchString})
  };

  // dawanda search
  function triggerDawandaSearch(searchString) {
    console.log("Run dawanda search")
    sendMessageToBackgroundScript({'task': 'dawandaSearch', "string": searchString})
  };

  function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(null, message, function(response) {
      if (response) {
        switch(response.task) {
          case "dawandaSearch":
            var imageContent = response.content.join('');
            // show results on amazon page
            // $(imageContent).insertAfter($('#nav-subnav'));
            popupContent.dawandaSearch = imageContent;
            break;
          case "ebaySearch":
            var imageContent = response.content.join('');
            // show results on amazon page
            // $(imageContent).insertAfter($('#nav-subnav'));
            popupContent.ebaySearch = imageContent;
            break;
        }
      }
      // retrieved data from dawanda and ebay
      if (popupContent.dawandaSearch.length !== 0 && popupContent.ebaySearch.length !== 0) {
        // inform the background page that
        // this tab should have a page-action (enable popup)
        chrome.runtime.sendMessage({
          task: 'showPageAction'
        });
      }
    });
  }

  // listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.task === 'getPopupContent') {

      console.log("listen to message from popup")
      sendResponse(popupContent);
    }
  })
})();