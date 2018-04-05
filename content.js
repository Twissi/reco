(function () {
  "use strict";

  console.log("### Run content.js")

  // amazon input selector
  const inputField = $('form.nav-searchbar input[type="text"]#twotabsearchtextbox');
  // amazon submit button selector
  const submitButton = $('form.nav-searchbar input[type="submit"]');
  // user search
  let searchString = "";
  // alternative search results
  let searchResults = new Results();

  // run search when page loads
  searchForAlternatives();

  // event listener for amazon search submit button
  submitButton.on("click", searchForAlternatives);

  function searchForAlternatives() {
    let validInput = inputField.length !== 0 && inputField.val() !== "";

    if( validInput && searchString !== inputField.val() ) {
      console.log("Found new search string: " + inputField.val());
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
            if (response.content !== "") {
              // parse html body
              let htmlNodes = $.parseHTML(response.content);
              let productNodes = $("#search_results .product-pic", htmlNodes);
              $.each(productNodes, (index, product) => {
                let title = $("img", product).attr("alt");
                let link = $(product).attr("href");
                let imageSrc = $("img", product).attr("src");
                let dawandaItem = new DawandaResult(title, link, imageSrc);
                searchResults.add(dawandaItem);
              })
            }
            break;
          case "ebaySearch":
            if (response.content !== "") {
              // parse html body
              let htmlNodes = $.parseHTML(response.content);
              let productNodes = $(".ad-listitem", htmlNodes);
              $.each(productNodes, (index, product) => {
                let title = $(".aditem-main a", product).html();
                let link = $(".aditem-main a", product).attr("href");
                let imageSrc = $(".imagebox", product).data("imgsrc");
                let ebayItem = new EbayResult(title, link, imageSrc);
                searchResults.add(ebayItem);
              })
            }
            break;
        }
      }
      // inform the background page that
      // this tab should have a page-action (enable popup)
      chrome.runtime.sendMessage({
        task: 'showPageAction'
      });
    });
  }

  // listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.task === 'getPopupContent') {

      console.log("listen to message from popup")
      sendResponse(searchResults.render());
    }
  })
})();