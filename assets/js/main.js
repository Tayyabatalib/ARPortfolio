/* ============================================================
   Akif Rahim — Portfolio · shared interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close menu when a link is clicked
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    if (backTop) backTop.classList.toggle("show", window.scrollY > 480);
  }

  /* ---- Back to top ---- */
  var backTop = document.querySelector(".back-top");
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1500;
          var start = performance.now();
          (function tick(now) {
            var p = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(start);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { counterIO.observe(c); });
  }

  /* ---- Current year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Card sliders (specializations, projects, awards) ---- */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var viewport = slider.querySelector("[data-slider-viewport]");
    var dotsWrap = slider.querySelector("[data-slider-dots]");
    var prevBtn = slider.querySelector("[data-slider-prev]");
    var nextBtn = slider.querySelector("[data-slider-next]");
    if (!viewport) return;

    var cards = Array.prototype.slice.call(viewport.children);
    if (!cards.length) return;

    function gap() {
      var g = parseFloat(getComputedStyle(viewport).columnGap);
      return isNaN(g) ? 24 : g;
    }
    function step() {
      return cards[0].getBoundingClientRect().width + gap();
    }
    function maxScroll() {
      return viewport.scrollWidth - viewport.clientWidth;
    }

    function scrollToIndex(i) {
      viewport.scrollTo({ left: i * step(), behavior: "smooth" });
    }

    // Build indicator dots — one per reachable scroll position
    var dots = [];
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      dots = [];
      var count = Math.max(1, Math.round(maxScroll() / step()) + 1);
      for (var i = 0; i < count; i++) {
        (function (index) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "slider-dot";
          dot.setAttribute("aria-label", "Go to slide " + (index + 1));
          dot.addEventListener("click", function () { scrollToIndex(index); });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    function update() {
      var max = maxScroll();
      var left = viewport.scrollLeft;
      var isStatic = max < 4;
      slider.classList.toggle("is-static", isStatic);
      if (prevBtn) prevBtn.disabled = isStatic || left <= 2;
      if (nextBtn) nextBtn.disabled = isStatic || left >= max - 2;
      if (!dots.length) return;
      var active = Math.round(left / step());
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === active);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        viewport.scrollBy({ left: -step(), behavior: "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        viewport.scrollBy({ left: step(), behavior: "smooth" });
      });
    }

    var scrollTick;
    viewport.addEventListener("scroll", function () {
      clearTimeout(scrollTick);
      scrollTick = setTimeout(update, 60);
    }, { passive: true });
    var resizeTick;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTick);
      resizeTick = setTimeout(function () { buildDots(); update(); }, 150);
    });
    buildDots();
    update();

    // Click-and-drag with a mouse (touch devices scroll natively)
    var down = false, dragged = false, startX = 0, startLeft = 0;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; dragged = false;
      startX = e.clientX; startLeft = viewport.scrollLeft;
      viewport.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6) dragged = true;
      viewport.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      viewport.classList.remove("dragging");
      if (dragged) {
        scrollToIndex(Math.round(viewport.scrollLeft / step()));
      }
    });
    // Suppress accidental clicks after a drag
    viewport.addEventListener("click", function (e) {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
    }, true);

    // Keyboard support
    viewport.setAttribute("tabindex", "0");
    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); viewport.scrollBy({ left: step(), behavior: "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); viewport.scrollBy({ left: -step(), behavior: "smooth" }); }
    });
  });

  /* ---- Rotating specialty word in the hero ---- */
  document.querySelectorAll("[data-rotator]").forEach(function (el) {
    var words = (el.getAttribute("data-rotator") || "").split("|").filter(Boolean);
    if (words.length < 2) return;
    var i = 0;
    el.textContent = words[0];
    setInterval(function () {
      i = (i + 1) % words.length;
      el.classList.add("out");
      setTimeout(function () {
        el.textContent = words[i];
        el.classList.add("in");
        void el.offsetWidth;            // flush styles so the swap is instant
        el.classList.remove("out");
        el.classList.remove("in");
      }, 300);
    }, 3000);
  });

  /* ---- Subtle hero parallax ---- */
  var hero = document.querySelector(".hero");
  var parallaxEl = document.querySelector("[data-parallax]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hero && parallaxEl && !reduceMotion && window.matchMedia("(min-width: 1021px)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      parallaxEl.style.transform = "translate3d(" + (x * -16) + "px," + (y * -12) + "px,0)";
    });
    hero.addEventListener("mouseleave", function () {
      parallaxEl.style.transform = "";
    });
  }

  /* ---- Contact form → mailto compose ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var subject = (data.get("subject") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();
      var mailSubject = subject || ("Portfolio inquiry from " + (name || "a visitor"));
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      window.location.href =
        "mailto:ak.rahim001@gmail.com?subject=" +
        encodeURIComponent(mailSubject) +
        "&body=" +
        encodeURIComponent(body);
      var note = document.getElementById("formNote");
      if (note) {
        note.textContent = "Opening your email client… If nothing happens, write to ak.rahim001@gmail.com directly.";
      }
    });
  }
})();
