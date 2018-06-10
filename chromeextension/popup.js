console.log("### Run popup script");

let statusDisplay = null;
const postUrl = "http://hau-rock.de/experiment/seite2.php";

// prefill savePage form
chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
  chrome.tabs.sendMessage(tab[0].id, { task: "pageMetadata" }, function(
    response
  ) {
    console.log("prefill");
    if (response) {
      document.getElementsByName("URL")[0].value = response.url || "";
      document.getElementsByName("Title")[0].value = response.title || "";
      document.getElementsByName("Description")[0].value =
        response.summary || "";
    }
  });
});

window.addEventListener("load", function(evt) {
  statusDisplay = document.getElementById("status-display");

  document.getElementById("savePage").addEventListener("submit", savePage);
});

// submit form
function savePage() {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.open("POST", postUrl, true);

  let title = document.getElementsByName("Title")[0];
  let url = document.getElementsByName("URL")[0];
  let description = document.getElementsByName("Description")[0];
  let searchtags = document.getElementsByName("SearchTags")[0];
  let environment = document.querySelector('input[name = "Environment"]:checked');
  let humanrights = document.querySelector('input[name = "Humanrights"]:checked');
  let health = document.querySelector('input[name = "Health"]:checked');
  let animalrights = document.querySelector('input[name = "Animalrights"]:checked');

  if (environment) {
    environment = encodeURIComponent(environment.value);
  } else {
    environment = "";
  }

  if (humanrights) {
    humanrights = encodeURIComponent(humanrights.value);
  } else {
    humanrights = "";
  }

  if (health) {
    health = encodeURIComponent(health.value);
  } else {
    health = "";
  }

  if (animalrights) {
    animalrights = encodeURIComponent(animalrights.value);
  } else {
    animalrights = "";
  }

  let params =
    "Title=" + encodeURIComponent(title.value) +
    "&URL=" + encodeURIComponent(url.value) +
    "&Description=" + encodeURIComponent(description.value) +
    "&SearchTags=" + encodeURIComponent(searchtags.value) +
    "&Environment=" + environment +
    "&Humanrights=" + humanrights +
    "&Health=" + health +
    "&Animalrights=" + animalrights;

  // Replace any instances of the URLEncoded space char with +
  params = params.replace(/%20/g, "+");
  const formContentType = "application/x-www-form-urlencoded";
  xhr.setRequestHeader("Content-type", formContentType);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      statusDisplay.innerHTML = "";
      if (xhr.status == 200) {
        console.log("saved!");
        statusDisplay.innerHTML = "Saved!";
      } else {
        console.log("error");
        statusDisplay.innerHTML = "Error saving: " + xhr.statusText;
      }
    }
  };

  xhr.send(params);
  statusDisplay.innerHTML = "Saving...";
}
