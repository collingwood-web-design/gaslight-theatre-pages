(function () {
  var galleries = document.querySelectorAll(".photo-gallery");
  if (!galleries.length) return;

  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous image">&#10094;</button>' +
    '<img class="lightbox-image" alt="">' +
    '<button type="button" class="lightbox-next" aria-label="Next image">&#10095;</button>';
  document.body.appendChild(lightbox);

  var lightboxImg = lightbox.querySelector(".lightbox-image");
  var activeItems = [];
  var activeIndex = 0;

  function openLightbox(items, index) {
    activeItems = items;
    activeIndex = index;
    showLightboxImage();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
  }

  function showLightboxImage() {
    var item = activeItems[activeIndex];
    if (!item) return;
    lightboxImg.src = item.getAttribute("href");
    lightboxImg.alt = item.querySelector("img") ? item.querySelector("img").alt : "";
  }

  function stepLightbox(delta) {
    if (!activeItems.length) return;
    activeIndex = (activeIndex + delta + activeItems.length) % activeItems.length;
    showLightboxImage();
  }

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
    stepLightbox(-1);
  });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
    stepLightbox(1);
  });
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });

  galleries.forEach(function (gallery) {
    var perPage = parseInt(gallery.getAttribute("data-per-page") || "4", 10);
    var grid = gallery.querySelector(".photo-gallery-grid");
    var pager = gallery.querySelector(".photo-gallery-pager");
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".photo-gallery-item"));
    var page = 0;

    function render() {
      var totalPages = Math.max(1, Math.ceil(items.length / perPage));
      if (page > totalPages - 1) page = totalPages - 1;

      items.forEach(function (item, index) {
        var show = index >= page * perPage && index < page * perPage + perPage;
        item.hidden = !show;
      });

      if (!pager) return;
      pager.innerHTML = "";
      if (items.length <= perPage) {
        pager.hidden = true;
        return;
      }

      pager.hidden = false;
      for (var i = 0; i < totalPages; i++) {
        (function (pageIndex) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = String(pageIndex + 1);
          btn.className = "photo-gallery-page" + (pageIndex === page ? " is-active" : "");
          btn.setAttribute("aria-label", "Gallery page " + (pageIndex + 1));
          if (pageIndex === page) btn.setAttribute("aria-current", "page");
          btn.addEventListener("click", function () {
            page = pageIndex;
            render();
          });
          pager.appendChild(btn);
        })(i);
      }

      if (page < totalPages - 1) {
        var next = document.createElement("button");
        next.type = "button";
        next.textContent = "Next";
        next.className = "photo-gallery-next";
        next.addEventListener("click", function () {
          page += 1;
          render();
        });
        pager.appendChild(next);
      }
    }

    items.forEach(function (item, index) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        openLightbox(items, index);
      });
    });

    render();
  });
})();
