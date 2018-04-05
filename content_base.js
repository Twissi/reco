function DawandaResult(title, link, imgSrc) {
  this.domain = "https://de.dawanda.com";
  this.title = title || "";
  this.link = this.domain + link;
  this.imgSrc = imgSrc || "";
}

DawandaResult.prototype = {
  render: function() {
    return '<a target="_blank" href="' + this.link + '">' + this.title + '<br/><img src="' + this.imgSrc + '"/></a>'
  }
}

function EbayResult(title, link, imgSrc) {
  this.domain = "https://www.ebay-kleinanzeigen.de";
  this.title = title || "";
  this.link = this.domain + link;
  this.imgSrc = imgSrc || "";
}

EbayResult.prototype = {
  render: function() {
    return '<a target="_blank" href="' + this.link + '">' + this.title + '<br/><img src="' + this.imgSrc + '"/></a>'
  }
}

DawandaResult.prototype = {
  render: function() {
    return '<a target="_blank" href="' + this.link + '">' + this.title + '<br/><img src="' + this.imgSrc + '"/></a>'
  }
}

function Results() {
  this.results = [];
}

Results.prototype = {
  add: function(result) {
    this.results.push(result);
  },
  render: function () {
    var elems = "";
    this.results.forEach(function(result) {
      elems = elems + result.render();
    })
    return elems;
  }
}