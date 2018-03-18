(function () {
  "use strict";

  console.log("Run content.js")
  const inputField = $('form.nav-searchbar input[type="text"]#twotabsearchtextbox');
  const submitButton = $('form.nav-searchbar input[type="submit"]');
  var popupContent = "";

  searchForAlternatives();

  //event listener
  submitButton.on("click", searchForAlternatives);

  function searchForAlternatives(){
    if( inputField.length !== 0 && inputField.val() !== "" ) {
      console.log("Found search string: " + inputField.val());
      var searchString = inputField.val();
      // triggerDawandaSearch(searchString);
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
    chrome.runtime.sendMessage(message, function(response) {
      if (response) {
        switch(response.task) {
          case "dawandaSearch":
            var imageContent = response.content.join('');
            // $(imageContent).insertAfter($('#nav-subnav'));
          case "ebaySearch":
            var imageContent = response.content.join('');
            // $(imageContent).insertAfter($('#nav-subnav'));

            popupContent = imageContent;
            // Inform the background page that
            // this tab should have a page-action
            chrome.runtime.sendMessage({
              task: 'showPageAction'
            });
        }
      }
    });
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.task === 'getPopupContent') {

      console.log("listen to message from popup")
      sendResponse(popupContent);
    }
  })
})();