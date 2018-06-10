(function() {
  "use strict";

  console.log("### Run content.js");

  const amazonRegex = '(http(s)?:\/\/)?(www)?(\.)?amazon\.de(\/.*)?';
  const pageUrl = window.location.href;

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
  if (pageUrl.search(amazonRegex) === -1) {
    return;
  } else {
    initSidebar();
    loadArticles();
    searchForAlternatives();
  }

  function initSidebar() {
    const sidebar = new Sidebar();
    $("body").addClass("reco-extension");
    $("body").append(sidebar.render());
    sidebar.setEventListener();

    // event listener for amazon search submit button
    const submitButton = $('form.nav-searchbar input[type="submit"]');
    submitButton.on("click", function(){
      console.log('submit button clicked');
      searchForAlternatives();
    });
  }

  function loadArticles() {
    console.log("Fetch articles");
    sendMessageToBackgroundScript({ task: "fetchArticles" });
  }

  function searchForAlternatives() {
    const inputField = $(
      'form.nav-searchbar input[type="text"]#twotabsearchtextbox'
    );
    const validInput = inputField.length !== 0 && inputField.val() !== "";
    let searchString = "";

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

  function showEbayResultsInSidebar(results) {
    const sidebarContent = $(".sidebar_drawer--used .content");
    if (results && results.length !== 0) {
      sidebarContent.append(results.render());
      const sidebarUsedBar = $(".sidebar_drawer--used .bar");
      const sidebarUsedBarButton = $(".sidebar_button--used .bar");
      sidebarUsedBar.addClass("bar--filled");
      sidebarUsedBarButton.addClass("bar--filled");
    } else {
      sidebarContent.html("");
    }
  }

  function showArticleResultsInSidebar(results) {
    const sidebarContent = $(".sidebar_drawer--articles .content");
    if (results && results.length !== 0) {
      sidebarContent.append(results.render());
      const sidebarArticleBar = $(".sidebar_drawer--articles .bar");
      const sidebarArticleBarButton = $(".sidebar_button--articles .bar");
      sidebarArticleBar.addClass("bar--filled");
      sidebarArticleBarButton.addClass("bar--filled");
    } else {
      sidebarContent.html("");
    }
  }

  function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(null, message, function(response) {
      if (response) {
        switch (response.task) {
          case "ebaySearch":
            if (response.content !== "") {
              // parse html body
              const htmlNodes = $.parseHTML(response.content);
              const productNodes = $(".ad-listitem", htmlNodes);
              const ebayResults = new Results();
              $.each(productNodes, (index, product) => {
                const title = $(".aditem-main a", product).html();
                const link = $(".aditem-main a", product).attr("href");
                const imageSrc = $(".imagebox", product).data("imgsrc");
                const ebayItem = new EbayResult(title, link, imageSrc);
                ebayResults.add(ebayItem);
              });
              console.log("Ebay results count:" + ebayResults.count());
              showEbayResultsInSidebar(ebayResults);
            }
            break;
          case "fetchArticles":
            if (response.content !== "") {
              const articleResults = new Results();
              const articlesJson = JSON.parse(response.content);
              $.each(articlesJson, (index, article) => {
                const newArticle = new Article(article.Title, article.Description, article.URL);
                articleResults.add(newArticle);
              });
              console.log("Show articles");
              showArticleResultsInSidebar(articleResults);
            }
            break;
        }
      }
    });
  }
})();
