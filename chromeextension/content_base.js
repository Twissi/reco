function Sidebar() {
  this.state = {
    closed: function(){
      $(".sidebar_drawers").addClass("hidden");
      $(".sidebar_drawer").addClass("hidden");
      $(".sidebar_buttons .sidebar_button").removeClass("hidden");
    },
    open: function(requestedDrawer) {
      $(".sidebar_drawers").removeClass("hidden");
      $(".sidebar_drawer--" + requestedDrawer).removeClass("hidden");
      $(".sidebar_buttons .sidebar_button--" + requestedDrawer).addClass("hidden");
    }
  };

  this.markup =
    '<div class="sidebar_bg"></div>' +
    '<div class="sidebar_drawers hidden">' +
    '<div class="sidebar_drawer sidebar_drawer--articles hidden">' +
    '<div class="sidebar_button sidebar_button--articles" data-content="articles"><div class="bar"></div></div>' +
    '<div class="headline">Wissenswert</div>' +
    '<div class="content"></div>' +
    "</div>" +
    '<div class="sidebar_drawer sidebar_drawer--alternatives hidden">' +
    '<div class="sidebar_button sidebar_button--alternatives" data-content="alternatives"><div class="bar"></div></div>' +
    '<div class="headline">Empfehlungen</div>' +
    '<div class="content"></div>' +
    "</div>" +
    '<div class="sidebar_drawer sidebar_drawer--diy hidden">' +
    '<div class="sidebar_button sidebar_button--diy" data-content="diy"><div class="bar"></div></div>' +
    '<div class="headline">Selbermachen</div>' +
    '<div class="content"></div>' +
    "</div>" +
    '<div class="sidebar_drawer sidebar_drawer--used hidden">' +
    '<div class="sidebar_button sidebar_button--used" data-content="used"><div class="bar"></div></div>' +
    '<div class="headline">Gebraucht</div>' +
    '<div class="content"></div>' +
    "</div>" +
    "</div>" +
    '<div class="sidebar_buttons">' +
    '<div class="sidebar_button sidebar_button--articles" data-content="articles"><div class="bar"></div></div>' +
    '<div class="sidebar_button sidebar_button--alternatives" data-content="alternatives"><div class="bar"></div></div>' +
    '<div class="sidebar_button sidebar_button--diy" data-content="diy"><div class="bar"></div></div>' +
    '<div class="sidebar_button sidebar_button--used" data-content="used"><div class="bar"></div></div>' +
    "</div>";
}

Sidebar.prototype = {
  render: function() {
    return this.markup;
  },
  setEventListener: function() {
    const self = this;
    $(".sidebar_button").click(function(){
      const requestedDrawer = $(this).data("content");
      console.log("onClick " + requestedDrawer);

      const requestDrawerIsHidden = $(".sidebar_drawer--" + requestedDrawer).hasClass("hidden");
      if (requestDrawerIsHidden) {
        self.state.closed();
        self.state.open(requestedDrawer);
      } else {
        self.state.closed();
      }
    });
  }
};

function EbayResult(title, link, imgSrc) {
  this.domain = "https://www.ebay-kleinanzeigen.de";
  this.title = title || "";
  this.link = this.domain + link;
  this.imgSrc = imgSrc || "";
}

EbayResult.prototype = {
  render: function() {
    return (
      '<a target="_blank" class="item" href="' +
      this.link +
      '">' +
      '<div class="item_image" style="background-image: url(' +
      this.imgSrc +
      ')">' +
      "</div>" +
      '<div class="item_description">' +
      this.title +
      "</div>" +
      "</a>"
    );
  }
};

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
  render: function() {
    var elems = "";
    this.results.forEach(function(result) {
      elems = elems + result.render();
    });
    return elems;
  }
};

function Articles() {
  this.articles = [];
};

Articles.prototype = {
  add: function(article) {
    this.articles.push(article);
  }
};

function Article(title, description, url, environment, health, humanrights, animalrights) {
  this.title = title || "";
  this.url = url || "";
  this.description = description || "";
  this.environment = environment || "";
  this.health = health || "";
  this.humanrights = humanrights || "";
  this.animalrights = animalrights || "";
};

Article.prototype = {
  render: function() {
    return (
      '<a target="_blank" class="item" href="' +
      this.url +
      '">' +
      '<div class="item_title">' +
      this.title +
      "</div>" +
      '<div class="item_description">' +
      this.description +
      "</div>" +
      "</a>"
    );
  }
};
