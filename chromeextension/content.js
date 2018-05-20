(function() {
  "use strict";

  console.log("### Run content.js");

  const amazonRegex = `/(http(s)?:\/\/)?(www)?(\.)?amazon\.de(\/.*)?/i`;
  const pageUrl = window.location.href;
  let sidebar;

  // listen to messages from popup
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message) {
      console.log("prefill content.js");
      switch (message.task) {
        case "pageMetadata":
          sendResponse({
            url: window.location.href,
            title: document.title,
            summary: window.getSelection().toString()
          });
          break;
      }
    }
  });

  // dont show extension for non-amazon pages
  if (pageUrl.search(amazonRegex) !== -1) {
    return;
  } else {
    initSidebar();
    searchForAlternatives();
  }

  function initSidebar() {
    sidebar = new Sidebar();
    $("body").addClass="reco-extension";
    $("body").append(sidebar.render());
    sidebar.setEventListener();

    // event listener for amazon search submit button
    const submitButton = $('form.nav-searchbar input[type="submit"]');
    submitButton.on("click", searchForAlternatives);
  }

  function searchForAlternatives() {
    const inputField = $(
      'form.nav-searchbar input[type="text"]#twotabsearchtextbox'
    );
    let validInput = inputField.length !== 0 && inputField.val() !== "";
    let searchString = "";
    let sidebar = $("#ecoSidebar");

    sidebar.remove();

    if (validInput && searchString !== inputField.val()) {
      console.log("Found new search string: " + inputField.val());
      searchString = inputField.val();
      triggerEbaySearch(searchString);
    }
  }

  function triggerEbaySearch(searchString) {
    console.log("Run ebay search");
    sendMessageToBackgroundScript({ task: "ebaySearch", string: searchString });
  }

  function showResultsInSidebar(results) {
    let sidebarContent = $(".sidebar_drawer--used .content");
    sidebarContent.append(results.render());
  }

  function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(null, message, function(response) {
      if (response) {
        switch (response.task) {
          case "ebaySearch":
            if (response.content !== "") {
              // parse html body
              let htmlNodes = $.parseHTML(response.content);
              let productNodes = $(".ad-listitem", htmlNodes);
              let ebayResults = new Results();
              $.each(productNodes, (index, product) => {
                let title = $(".aditem-main a", product).html();
                let link = $(".aditem-main a", product).attr("href");
                let imageSrc = $(".imagebox", product).data("imgsrc");
                let ebayItem = new EbayResult(title, link, imageSrc);
                ebayResults.add(ebayItem);
              });
              console.log("Ebay results count:" + ebayResults.count());
              showResultsInSidebar(ebayResults);
            }
            break;
        }
      }
    });
  }
})();
