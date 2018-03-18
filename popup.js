console.log("Run popup script")

chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
  chrome.tabs.sendMessage(tab[0].id,{'task': 'getPopupContent'}, function(response){
    console.log(response);

    document.getElementById("contentEbay").innerHTML = "EbayImages: " + response;

  });
});