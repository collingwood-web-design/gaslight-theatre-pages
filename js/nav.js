(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var toggle = header.querySelector(".nav-toggle");
  var nav = header.querySelector(".site-nav");
  var subButtons = header.querySelectorAll(".has-sub > button");

  function closeSubs(except) {
    header.querySelectorAll(".has-sub.is-open").forEach(function (item) {
      if (item !== except) {
        item.classList.remove("is-open");
        var btn = item.querySelector(":scope > button");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) closeSubs();
    });
  }

  subButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = btn.parentElement;
      var willOpen = !parent.classList.contains("is-open");
      closeSubs(parent);
      parent.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!header.contains(event.target)) {
      closeSubs();
      if (nav) nav.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSubs();
      if (nav) nav.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
