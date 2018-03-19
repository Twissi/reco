console.log("### Run popup script")

chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
  chrome.tabs.sendMessage(tab[0].id,{'task': 'getPopupContent'}, function(response){

    // add images to popup
    document.getElementById("contentEbay").innerHTML = "EbayImages: " + response.ebaySearch;
    document.getElementById("contentDawanda").innerHTML = "DawandaImages: " + response.dawandaSearch;

  });
});