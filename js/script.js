// script.js
(function () {
  // Run after DOM is ready (safe even if script moves to <head>)
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // Normalize a path or href into a comparable "file key"
  // Examples:
  //  "/about.html" -> "about.html"
  //  "/about/"     -> "about.html"   (assume folder index)
  //  "/"           -> "index.html"
  function normalizeToFileKey(inputPath) {
    if (!inputPath) return "index.html";

    // remove query/hash
    let p = inputPath.split("#")[0].split("?")[0];

    // if it's just "/", treat as index.html
    if (p === "/" || p === "") return "index.html";

    // remove trailing slash
    if (p.endsWith("/")) p = p.slice(0, -1);

    // last segment
    let last = p.split("/").pop() || "index.html";

    // Jekyll pretty URL folders: /about  or /about/
    // treat as about.html (your site uses .html files)
    if (!last.includes(".")) last = last + ".html";

    return last.toLowerCase();
  }

  onReady(function () {
    // ✅ Auto year (if #year exists)
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Current page file key
    const currentFile = normalizeToFileKey(window.location.pathname);

    // ✅ Auto-highlight current page links (TOP NAV + FOOTER)
    // Works anywhere you use: <a data-nav href="...">
    document.querySelectorAll("a[data-nav]").forEach((a) => {
      const rawHref = (a.getAttribute("href") || "").trim();

      // Nothing useful
      if (!rawHref || rawHref === "#") {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
        return;
      }

      const href = rawHref.toLowerCase();

      // Skip non-page links
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("javascript:")
      ) {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
        return;
      }

      // Compare by normalized "file key"
      const hrefFile = normalizeToFileKey(href);

      if (hrefFile === currentFile) {
        a.setAttribute("aria-current", "page");
        a.classList.add("active");
      } else {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
      }
    });

    // ===== LANGUAGE DROPDOWN =====
    const langBtn = document.getElementById("langBtn");
    const langDropdown = document.getElementById("langDropdown");
    const currentLangText = document.getElementById("currentLangText");
    const langOptions = document.querySelectorAll(".lang-option");

    if (langBtn && langDropdown && currentLangText && langOptions.length) {
      const path = window.location.pathname.toLowerCase();
      const fileName = normalizeToFileKey(path); // always returns xxx.html

      let currentCode = "en";
      if (path.includes("/vi/")) currentCode = "vi";
      else if (path.includes("/zh/")) currentCode = "zh";
      else if (path.includes("/hi/")) currentCode = "hi";
      else if (path.includes("/es/")) currentCode = "es";

      langOptions.forEach((option) => {
        const code = option.getAttribute("data-lang");
        const label = option.getAttribute("data-label");

        if (code === currentCode) {
          currentLangText.textContent = label;
          option.classList.add("active");
        } else {
          option.classList.remove("active");
        }

        option.addEventListener("click", function () {
          let target = "index.html";

          if (code === "vi") target = "vi/" + fileName;
          else if (code === "zh") target = "zh/" + fileName;
          else if (code === "hi") target = "hi/" + fileName;
          else if (code === "es") target = "es/" + fileName;
          else target = fileName; // en

          // If currently in a language folder, go up one level first
          if (currentCode !== "en") {
            if (code === "en") target = "../" + fileName;
            else target = "../" + target;
          }

          window.location.href = target;
        });
      });

      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();

        const isOpen = !langDropdown.hasAttribute("hidden");
        if (isOpen) {
          langDropdown.setAttribute("hidden", "");
          langBtn.setAttribute("aria-expanded", "false");
        } else {
          langDropdown.removeAttribute("hidden");
          langBtn.setAttribute("aria-expanded", "true");
        }
      });

      langDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      document.addEventListener("click", function () {
        langDropdown.setAttribute("hidden", "");
        langBtn.setAttribute("aria-expanded", "false");
      });
    }
  });
})();