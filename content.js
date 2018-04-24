(function () {
  "use strict";

  console.log("### Run content.js")

  // amazon input selector
  const inputField = $('form.nav-searchbar input[type="text"]#twotabsearchtextbox');
  // amazon submit button selector
  const submitButton = $('form.nav-searchbar input[type="submit"]');
  // amazon page
  const pageContent = $('#a-page');
  // user search
  let searchString = "";

  // run search when page loads
  searchForAlternatives();

  // event listener for amazon search submit button
  submitButton.on("click", searchForAlternatives);

  function searchForAlternatives() {
    let validInput = inputField.length !== 0 && inputField.val() !== "";
    let sidebar = $('#ecoSidebar');

    sidebar.remove();

    if( validInput && searchString !== inputField.val() ) {
      console.log("Found new search string: " + inputField.val());
      searchString = inputField.val();
      triggerEbaySearch(searchString);
    }
  }

  // ebay search
  function triggerEbaySearch(searchString) {
    console.log("Run ebay search")
    sendMessageToBackgroundScript({'task': 'ebaySearch', "string": searchString})
  };

  function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(null, message, function(response) {
      if (response) {
        switch(response.task) {
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
              })
              console.log('Ebay results count:' + ebayResults.count());
              showResultsInSidebar(ebayResults);
            }
            break;
        }
      }
    });
  }

  function showResultsInSidebar(results) {
    let sidebar = $('#ecoSidebar');
    if (sidebar.length === 0) {
      let windowHeight = $( window ).height();
      let sidebar = $('<div id="ecoSidebar"></div>').css({
        width: '30%',
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        height: windowHeight,
        overflow: 'scroll',
        zIndex: 1000,
        border: '1px solid #eee'
      });
      sidebar.html(results.render());
      $('body').append(sidebar);
      pageContent.css('width', '70%');
    } else {
      sidebar.append(results.render());
    }
  }

  // listen to messages from popup
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message) {
      switch(message.task) {
        case "pageMetadata":
          sendResponse({
            'url': window.location.href,
            'title': document.title,
            'summary': window.getSelection().toString()
          });
          break;
      }
    }
  });
})();