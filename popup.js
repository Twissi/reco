console.log("### Run popup script")

chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
  chrome.tabs.sendMessage(tab[0].id,{'task': 'getPopupContent'}, function(response){

    if (response) {
      // add images to popup
      // document.getElementById("contentEbay").innerHTML = "EbayImages: " + response.ebayItems;
      document.getElementById("contentDawanda").innerHTML = "DawandaImages: <br/>" + response;
    }
  });
});