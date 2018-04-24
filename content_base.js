function Sidebar(){
  this.markup = '<div id="sidebar">' +
      '<div class="sidebar_drawer sidebar_drawer--articles hidden">Wissenswert</div>' +
      '<div class="sidebar_drawer sidebar_drawer--alternatives hidden">Empfehlungen</div>' +
      '<div class="sidebar_drawer sidebar_drawer--diy hidden">Selbermachen</div>' +
      '<div class="sidebar_drawer sidebar_drawer--used hidden">Gebraucht</div>' +
      '<div class="sidebar_buttons">' +
        '<div class="sidebar_button sidebar_button--articles" data-content="articles"></div>' +
        '<div class="sidebar_button sidebar_button--alternatives" data-content="alternatives"></div>' +
        '<div class="sidebar_button sidebar_button--diy" data-content="diy"></div>' +
        '<div class="sidebar_button sidebar_button--used" data-content="used"></div>' +
      '</div>' +
    '</div>';
}

Sidebar.prototype = {
 render: function() {
   return this.markup;
 },
 setEventListener: function() {
  $(".sidebar_button").click(this.onClickEvent);
 },
 onClickEvent: function(event) {
  let requestedDrawer = $(this).data("content");
  console.log("onClick " + requestedDrawer);
  if ($(".sidebar_drawer--" + requestedDrawer).is(":visible")) {
    $(".sidebar_drawer--" + requestedDrawer).hide("slow");
  } else {
    $(".sidebar_drawer").hide();
    $(".sidebar_drawer--" + requestedDrawer).show("slow");
  }
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