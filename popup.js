console.log("### Run popup script")

let statusDisplay = null;
let postUrl = 'http://hau-rock.de/experiment/seite2.php';

// prefill savePage form
chrome.tabs.query({'active': true,'currentWindow': true}, function(tab){
  chrome.tabs.sendMessage(tab[0].id, {'task': 'pageMetadata'}, function(response){
    if (response){
      document.getElementById('url').value = response.url || '';
      document.getElementById('title').value = response.title || '';
      document.getElementById('summary').value = response.summary || '';
    }
  });
});

window.addEventListener('load', function(evt) {
  statusDisplay = document.getElementById('status-display');

  document.getElementById('savePage').addEventListener('submit', savePage);
});

// submit form
function savePage() {
  event.preventDefault();

  let xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);

  // Prepare the data to be POSTed by URLEncoding each field's contents
  let title = document.getElementById('title');
  let url = document.getElementById('url');
  let summary = document.getElementById('summary');
  let searchtags = document.getElementById('searchtags');
  let alternative = document.getElementById('alternative');


  let params = 'Title=' + encodeURIComponent(title.value) +
               '&URL=' + encodeURIComponent(url.value) +
               '&Description=' + encodeURIComponent(summary.value) +
               '&SearchTags=' + encodeURIComponent(searchtags.value) +
               '&AlternativeTags=' + encodeURIComponent(alternative.value);
               '&Environment=' + encodeURIComponent(environment.value);


  // Replace any instances of the URLEncoded space char with +
  params = params.replace(/%20/g, '+');

  let formContentType = 'application/x-www-form-urlencoded';
  xhr.setRequestHeader('Content-type', formContentType);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      statusDisplay.innerHTML = '';
      if (xhr.status == 200) {
        console.log("saved!");
        statusDisplay.innerHTML = 'Saved!';
      } else {
        console.log("error");
        statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
      }
    }
  };

  xhr.send(params);
  statusDisplay.innerHTML = 'Saving...';
}
