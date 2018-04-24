function EbayResult(title, link, imgSrc) {
  this.domain = "https://www.ebay-kleinanzeigen.de";
  this.title = title || "";
  this.link = this.domain + link;
  this.imgSrc = imgSrc || "";
}

EbayResult.prototype = {
  render: function() {
    return '<div class="item"><a target="_blank" href="' + this.link + '">' + this.title + ' @Ebay<br/><img src="' + this.imgSrc + '"/></a></div>'
  }
}

function Results() {
  this.results = [];
}

Results.prototype = {
  add: function(result) {
    this.results.push(result);
  },
  count: function() {
    return this.results.length;
  },
  render: function () {
    var elems = "";
    this.results.forEach(function(result) {
      elems = elems + result.render();
    })
    return elems;
  }
}