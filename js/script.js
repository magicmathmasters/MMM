// script.js
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalizeToFileKey(inputPath) {
    if (!inputPath) return "index.html";

    let p = inputPath.split("#")[0].split("?")[0];

    if (p === "/" || p === "") return "index.html";
    if (p.endsWith("/")) p = p.slice(0, -1);

    let last = p.split("/").pop() || "index.html";
    if (!last.includes(".")) last = last + ".html";

    return last.toLowerCase();
  }

  onReady(function () {
    // =========================
    // Auto year
    // =========================
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // =========================
    // iPad detection
    // =========================
    try {
      const isIpad =
        /iPad/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      if (isIpad) {
        document.body.classList.add("is-ipad");
      }
    } catch (e) {
      // do nothing
    }

    // =========================
    // Active nav highlighting
    // =========================
    const currentFile = normalizeToFileKey(window.location.pathname);

    document.querySelectorAll("a[data-nav]").forEach((a) => {
      const rawHref = (a.getAttribute("href") || "").trim();

      if (!rawHref || rawHref === "#") {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
        return;
      }

      const href = rawHref.toLowerCase();

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

      const hrefFile = normalizeToFileKey(href);

      if (hrefFile === currentFile) {
        a.setAttribute("aria-current", "page");
        a.classList.add("active");
      } else {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
      }
    });

    // =========================
    // Language dropdown
    // =========================
    const langBtn = document.getElementById("langBtn");
    const langDropdown = document.getElementById("langDropdown");
    const currentLangText = document.getElementById("currentLangText");
    const langOptions = document.querySelectorAll(".lang-option");

    if (langBtn && langDropdown && currentLangText && langOptions.length) {
      const path = window.location.pathname.toLowerCase();
      const fileName = normalizeToFileKey(path);

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
          else target = fileName;

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

    // =========================
    // Philosophy page quick links
    // =========================
    const philosophyJumpButtons = Array.from(
      document.querySelectorAll(".ql-btn[data-jump]")
    );

    if (
      philosophyJumpButtons.length &&
      (document.getElementById("our-philosophy") ||
        document.getElementById("how-we-teach"))
    ) {
      function setPhilosophyActive(id) {
        philosophyJumpButtons.forEach((btn) => btn.classList.remove("is-active"));
        const match = philosophyJumpButtons.find(
          (btn) => btn.getAttribute("data-jump") === id
        );
        if (match) match.classList.add("is-active");
      }

      function flashPhilosophyCard(section) {
        if (!section) return;
        const card = section.querySelector(".card");
        if (!card) return;

        card.classList.remove("anchor-flash");
        void card.offsetWidth;
        card.classList.add("anchor-flash");

        window.setTimeout(() => {
          card.classList.remove("anchor-flash");
        }, 1300);
      }

      function goToPhilosophySection(id) {
        const el = document.getElementById(id);
        if (!el) return;

        history.replaceState(null, "", "#" + id);
        setPhilosophyActive(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        window.setTimeout(() => {
          flashPhilosophyCard(el);
        }, 220);
      }

      philosophyJumpButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          goToPhilosophySection(btn.getAttribute("data-jump"));
        });
      });

      const initialHash = (window.location.hash || "").replace("#", "");
      if (initialHash) {
        setPhilosophyActive(initialHash);
      }
    }

    // =========================
    // Enquiry form
    // =========================
    const enquiryForm = document.getElementById("enquiryForm");
    const enquiryIframe = document.querySelector('iframe[name="enquirySubmitFrame"]');
    const enquiryModal = document.getElementById("thankYouModal");
    const enquiryOkBtn = document.getElementById("thankYouOkBtn");

    if (enquiryForm && enquiryIframe && enquiryModal) {
      let enquirySubmitted = false;

      enquiryIframe.addEventListener("load", () => {
        if (!enquirySubmitted) return;
        enquirySubmitted = false;
        enquiryModal.style.display = "flex";
        enquiryForm.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      enquiryForm.addEventListener("submit", () => {
        enquirySubmitted = true;
      });

      if (enquiryOkBtn) {
        enquiryOkBtn.addEventListener("click", () => {
          enquiryModal.style.display = "none";
        });
      }

      enquiryModal.addEventListener("click", (e) => {
        if (e.target === enquiryModal) {
          enquiryModal.style.display = "none";
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && enquiryModal.style.display === "flex") {
          enquiryModal.style.display = "none";
        }
      });
    }

    // =========================
    // Register form
    // =========================
    const registerForm = document.getElementById("registerForm");
    const registerIframe = document.querySelector('iframe[name="registerSubmitFrame"]');
    const registerModal = document.getElementById("registerThankYouModal");
    const registerOkBtn = document.getElementById("registerThankYouOkBtn");
    const registerCheckboxGroup = Array.from(
      document.querySelectorAll('input[name="register_for"]')
    );
    const registerError = document.getElementById("registerError");

    if (registerForm && registerIframe && registerModal) {
      let registerSubmissionPending = false;

      function validatePrograms() {
        if (!registerCheckboxGroup.length) return true;

        const hasSelection = registerCheckboxGroup.some((box) => box.checked);

        if (registerError) {
          registerError.classList.toggle("show", !hasSelection);
        }

        registerCheckboxGroup.forEach((box) => {
          box.setCustomValidity(hasSelection ? "" : "Please select at least one program.");
        });

        return hasSelection;
      }

      registerCheckboxGroup.forEach((box) => {
        box.addEventListener("change", validatePrograms);
      });

      function syncSelectOther(select) {
        const targetId = select.dataset.target;
        const otherValue = select.dataset.otherValue;
        if (!targetId || !otherValue) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        const isActive = select.value === otherValue;
        target.classList.toggle("show", isActive);

        const field = target.querySelector("input, textarea, select");
        if (field) {
          field.required = isActive;
          if (!isActive) field.value = "";
        }
      }

      registerForm.querySelectorAll("select[data-target]").forEach((select) => {
        select.addEventListener("change", () => syncSelectOther(select));
        syncSelectOther(select);
      });

      function closeRegisterModal() {
        registerModal.style.display = "none";
      }

      if (registerOkBtn) {
        registerOkBtn.addEventListener("click", closeRegisterModal);
      }

      registerModal.addEventListener("click", (e) => {
        if (e.target === registerModal) {
          closeRegisterModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && registerModal.style.display === "flex") {
          closeRegisterModal();
        }
      });

      registerIframe.addEventListener("load", () => {
        if (!registerSubmissionPending) return;

        registerSubmissionPending = false;
        registerModal.style.display = "flex";

        registerForm.reset();

        registerForm.querySelectorAll("select[data-target]").forEach((select) => {
          syncSelectOther(select);
        });

        validatePrograms();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      registerForm.addEventListener("submit", (event) => {
        const programsValid = validatePrograms();

        if (!programsValid || !registerForm.checkValidity()) {
          event.preventDefault();
          registerForm.reportValidity();
          return;
        }

        registerSubmissionPending = true;
      });

      validatePrograms();
    }

    // =========================
    // Club register form
    // =========================
    const clubForm = document.getElementById("mathsClubRegisterForm");
    const studentTable = document.getElementById("studentTable");

    if (clubForm && studentTable) {
      const tableBody = document.querySelector("#studentTable tbody");
      const firstRowTemplate =
        tableBody && tableBody.rows.length ? tableBody.rows[0].cloneNode(true) : null;

      const clubOptions = document.querySelectorAll(".club-option");
      const clubRadios = document.querySelectorAll('input[name="clubStream"]');
      const prep6Radio = document.getElementById("club-prep6");

      const prepSubgroupWrap = document.getElementById("prepSubgroupWrap");
      const prepSubgroupRadios = document.querySelectorAll('input[name="prepSubgroup"]');

      const submitFrame = document.querySelector('iframe[name="clubRegisterSubmitFrame"]');
      const successMessage = document.getElementById("successMessage");

      const competitionMode = document.getElementById("competitionMode");
      const competitionLocationGroup = document.getElementById("competitionLocationGroup");
      const competitionLocation = document.getElementById("competitionLocation");

      const clubStreamField = document.getElementById("clubStreamField");
      const prepSubgroupField = document.getElementById("prepSubgroupField");
      const studentsField = document.getElementById("studentsField");

      const thankYouModal = document.getElementById("clubThankYouModal");
      const thankYouOkBtn = document.getElementById("clubThankYouOkBtn");

      let submissionPending = false;

      function openThankYouModal() {
        if (!thankYouModal) return;
        thankYouModal.style.display = "flex";
        if (thankYouOkBtn) thankYouOkBtn.focus();
      }

      function closeThankYouModal() {
        if (!thankYouModal) return;
        thankYouModal.style.display = "none";
      }

      if (thankYouOkBtn) {
        thankYouOkBtn.addEventListener("click", closeThankYouModal);
      }

      if (thankYouModal) {
        thankYouModal.addEventListener("click", (e) => {
          if (e.target === thankYouModal) closeThankYouModal();
        });
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && thankYouModal && thankYouModal.style.display === "flex") {
          closeThankYouModal();
        }
      });

      function clearRowValues(row) {
        row.querySelectorAll("input, select").forEach((field) => {
          if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false;
          } else {
            field.value = "";
          }
        });
      }

      function updateRowNumbers() {
        document.querySelectorAll("#studentTable tbody tr").forEach((row, index) => {
          const cell = row.querySelector(".row-number");
          if (cell) cell.textContent = index + 1;
        });
      }

      window.addRow = function () {
        if (!firstRowTemplate || !tableBody) return;
        const newRow = firstRowTemplate.cloneNode(true);
        clearRowValues(newRow);
        tableBody.appendChild(newRow);
        updateRowNumbers();
      };

      window.removeRow = function (button) {
        if (!tableBody) return;

        if (tableBody.rows.length === 1) {
          alert("At least one student row must remain in the register.");
          return;
        }

        const row = button.closest("tr");
        if (row) row.remove();
        updateRowNumbers();
      };

      window.resetTable = function () {
        if (!tableBody || tableBody.rows.length === 0) return;
        while (tableBody.rows.length > 1) tableBody.deleteRow(1);
        clearRowValues(tableBody.rows[0]);
        updateRowNumbers();
      };

      function resetClubSelection() {
        clubRadios.forEach((r) => {
          r.checked = false;
        });

        prepSubgroupRadios.forEach((r) => {
          r.checked = false;
          r.required = false;
        });

        clubOptions.forEach((card) => card.classList.remove("active"));

        if (prepSubgroupWrap) prepSubgroupWrap.classList.remove("show");
      }

      function updateClubUI() {
        clubOptions.forEach((card) => {
          const radio = card.querySelector('input[type="radio"]');
          card.classList.toggle("active", !!radio && radio.checked);
        });

        if (prep6Radio && prep6Radio.checked) {
          if (prepSubgroupWrap) prepSubgroupWrap.classList.add("show");
          prepSubgroupRadios.forEach((r) => {
            r.required = true;
          });
        } else {
          if (prepSubgroupWrap) prepSubgroupWrap.classList.remove("show");
          prepSubgroupRadios.forEach((r) => {
            r.required = false;
            r.checked = false;
          });
        }
      }

      function updateCompetitionLocation() {
        const needsLocation =
          competitionMode && competitionMode.value === "In-person (if available)";

        if (!competitionLocationGroup || !competitionLocation) return;

        competitionLocationGroup.style.display = needsLocation ? "block" : "none";
        competitionLocation.required = !!needsLocation;

        if (!needsLocation) competitionLocation.value = "";
      }

      function collectPayload() {
        const selectedClub = document.querySelector('input[name="clubStream"]:checked');
        const selectedPrepSubgroup = document.querySelector('input[name="prepSubgroup"]:checked');
        const rows = Array.from(document.querySelectorAll("#studentTable tbody tr"));

        const students = rows.map((row, index) => ({
          rowNumber: index + 1,
          studentName:
            row.querySelector('input[name="studentName[]"]')?.value.trim() || "",
          preferredName:
            row.querySelector('input[name="preferredName[]"]')?.value.trim() || "",
          grade: row.querySelector('select[name="grade[]"]')?.value || "",
          school: row.querySelector('input[name="school[]"]')?.value.trim() || "",
          mathsFocus: row.querySelector('select[name="mathsFocus[]"]')?.value || "",
          studentNotes:
            row.querySelector('input[name="studentNotes[]"]')?.value.trim() || ""
        }));

        return {
          clubStream: selectedClub ? selectedClub.value : "",
          prepSubgroup: selectedPrepSubgroup ? selectedPrepSubgroup.value : "",
          students
        };
      }

      clubRadios.forEach((r) => r.addEventListener("change", updateClubUI));

      if (competitionMode) {
        competitionMode.addEventListener("change", updateCompetitionLocation);
      }

      if (submitFrame) {
        submitFrame.addEventListener("load", () => {
          if (!submissionPending) return;
          submissionPending = false;

          if (successMessage) {
            successMessage.style.display = "block";
            successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }

          openThankYouModal();

          clubForm.reset();
          window.resetTable();
          resetClubSelection();
          updateCompetitionLocation();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      clubForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const clubChosen = document.querySelector('input[name="clubStream"]:checked');
        const prepSubChosen = document.querySelector('input[name="prepSubgroup"]:checked');

        if (!clubChosen) {
          alert("Please choose one Maths Club stream before submitting.");
          return;
        }

        if (prep6Radio && prep6Radio.checked && !prepSubChosen) {
          alert("Please choose either Prep–2 or Years 3–6 for Primary Maths Club.");
          return;
        }

        if (!clubForm.checkValidity()) {
          clubForm.reportValidity();
          return;
        }

        const payload = collectPayload();

        if (clubStreamField) clubStreamField.value = payload.clubStream;
        if (prepSubgroupField) prepSubgroupField.value = payload.prepSubgroup;
        if (studentsField) studentsField.value = JSON.stringify(payload.students);

        submissionPending = true;
        HTMLFormElement.prototype.submit.call(clubForm);
      });

      updateClubUI();
      updateCompetitionLocation();
    }

    // =========================
    // Pricing page
    // =========================
    const priceBody = document.getElementById("priceBody");

    if (priceBody) {
      const pricingRows = [
        {
          icon: "👩‍🏫",
          program: "One-to-One",
          p30: { online: 55, inperson: 60 },
          p60: { online: 100, inperson: 110 }
        },
        {
          icon: "👩‍👦",
          program: "2 students",
          p30: { online: 45, inperson: 50 },
          p60: { online: 80, inperson: 90 }
        },
        {
          icon: "👨‍👩‍👧",
          program: "3 students",
          p30: { online: 35, inperson: 40 },
          p60: { online: 60, inperson: 70 }
        },
        {
          icon: "👨‍👩‍👧‍👦",
          program: "4 students",
          p30: { online: 30, inperson: 35 },
          p60: { online: 50, inperson: 60 }
        },
        {
          icon: "👨‍👩‍👧‍👦🧑",
          program: "5 students",
          p30: { online: 25, inperson: 30 },
          p60: { online: 40, inperson: 50 },
          min60: true
        },
        {
          icon: "👨‍👩‍👧‍👦🧑+",
          program: "5+ students",
          p30: { online: 20, inperson: 25 },
          p60: { online: 35, inperson: 45 },
          min60: true
        }
      ];

      const adjustments = {
        primary: {
          add30: -5,
          add60: -10,
          badge: "Primary adjustment",
          rule: "Primary Maths: –$5 (30 min) and –$10 (60 min) per student.",
          extra: "Tip: If your child needs enrichment or extension, ask about a tailored plan."
        },
        mid: {
          add30: 0,
          add60: 0,
          badge: "Standard pricing",
          rule: "Years 7–10 Maths: standard pricing (no adjustment).",
          extra: "Tip: 60-minute sessions allow more practice + feedback."
        },
        vce: {
          extra: "For VCE Maths, 60-minute sessions are strongly recommended."
        }
      };

      const vceSubjects = {
        general: {
          add30: +10,
          add60: +15,
          label: "VCE General Maths: +$10 (30) and +$15 (60) per student."
        },
        methods: {
          add30: +15,
          add60: +20,
          label: "VCE Maths Methods: +$15 (30) and +$20 (60) per student."
        },
        specialist: {
          add30: +20,
          add60: +25,
          label: "VCE Specialist Maths: +$20 (30) and +$25 (60) per student."
        }
      };

      const tracks = {
        standard: {
          add30: 0,
          add60: 0,
          name: "Standard",
          label: "Standard tutoring: +$0.",
          min60: false,
          extra: "Focus: school learning, homework support, confidence building."
        },
        extension: {
          add30: +5,
          add60: +10,
          name: "Extension",
          label: "Extension: +$5 (30) and +$10 (60) per student.",
          min60: false,
          extra: "Focus: enrichment, deeper understanding, higher-level questions."
        },
        selective: {
          add30: +10,
          add60: +20,
          name: "Selective tests",
          label: "Selective tests: +$10 (30) and +$20 (60) per student.",
          min60: true,
          extra: "Focus: test technique, speed, reasoning, practice papers."
        },
        amc: {
          add30: +15,
          add60: +25,
          name: "AMC/AMO",
          label: "AMC/AMO: +$15 (30) and +$25 (60) per student.",
          min60: true,
          extra: "Focus: competition problem solving, strategies, advanced reasoning."
        },
        amointensive: {
          add30: +20,
          add60: +30,
          name: "AMO Intensive",
          label: "AMO Intensive: +$20 (30) and +$30 (60) per student.",
          min60: true,
          extra: "Focus: advanced Olympiad training, proofs, and high-difficulty problem sets."
        }
      };

      let currentLevel = "primary";
      let currentVce = "general";
      let currentTrack = "standard";

      const money = (n) => `$${Math.max(0, n)}`;

      function yearAdj() {
        if (currentLevel === "vce") return vceSubjects[currentVce];
        return adjustments[currentLevel];
      }

      function totalAdd30() {
        const y = yearAdj();
        const t = tracks[currentTrack];
        return (y.add30 || 0) + (t.add30 || 0);
      }

      function totalAdd60() {
        const y = yearAdj();
        const t = tracks[currentTrack];
        return (y.add60 || 0) + (t.add60 || 0);
      }

      function priceCells(online, inperson) {
        return `
          <div class="cells">
            <div class="pricebox">
              <div class="price">${money(online)}</div>
              <div class="tag online">🌐 Online</div>
            </div>
            <div class="pricebox">
              <div class="price">${money(inperson)}</div>
              <div class="tag inperson">📍 In-person</div>
            </div>
          </div>
        `;
      }

      function selectionLabel() {
        const yearLabel =
          currentLevel === "primary"
            ? "Primary"
            : currentLevel === "mid"
              ? "Years 7–10"
              : `VCE ${currentVce.charAt(0).toUpperCase() + currentVce.slice(1)}`;

        return `${yearLabel} • ${tracks[currentTrack].name}`;
      }

      function updateFeesAtGlance() {
        const add30 = totalAdd30();
        const add60 = totalAdd60();

        const oneToOne = pricingRows[0];
        const force60_1to1 = !!oneToOne.min60 || tracks[currentTrack].min60;

        const online60 = oneToOne.p60.online + add60;
        const inperson60 = oneToOne.p60.inperson + add60;

        const glancePriceOnline = document.getElementById("glance-price-online");
        const glancePriceInperson = document.getElementById("glance-price-inperson");
        const glanceBadgeOnline = document.getElementById("glance-badge-online");
        const glanceBadgeInperson = document.getElementById("glance-badge-inperson");
        const glanceBadge30 = document.getElementById("glance-badge-30");
        const glance30Price = document.getElementById("glance-price-30");
        const glance30Note = document.getElementById("glance-30-note");
        const glance30Helper = document.getElementById("glance-30-helper");
        const glanceBadge5Plus = document.getElementById("glance-badge-5plus");
        const glancePrice5Plus = document.getElementById("glance-price-5plus");
        const glancePer5Plus = document.getElementById("glance-per-5plus");

        if (!glancePriceOnline) return;

        glancePriceOnline.textContent = `$${online60}`;
        if (glancePriceInperson) glancePriceInperson.textContent = `$${inperson60}`;

        const label = selectionLabel();
        if (glanceBadgeOnline) glanceBadgeOnline.textContent = `1-to-1 • 60 min • ${label}`;
        if (glanceBadgeInperson) glanceBadgeInperson.textContent = `1-to-1 • 60 min • ${label}`;
        if (glanceBadge30) glanceBadge30.textContent = `1-to-1 • 30 min • ${label}`;

        if (glance30Price && glance30Note && glance30Helper) {
          if (force60_1to1) {
            glance30Price.textContent = "60-min required";
            glance30Note.textContent =
              "This selection requires 60-minute sessions for quality/results.";
            glance30Helper.innerHTML =
              "<strong>Why?</strong> These programs need time for strategy + deep practice + feedback.";
          } else {
            const online30 = oneToOne.p30.online + add30;
            const inperson30 = oneToOne.p30.inperson + add30;
            glance30Price.textContent = `$${online30} / $${inperson30}`;
            glance30Note.textContent = "Online / In-person (per student)";
            glance30Helper.textContent =
              "Tip: 60 minutes usually gives better progress (more time for practice + feedback).";
          }
        }

        const fivePlus = pricingRows[5];
        const online60_5p = fivePlus.p60.online + add60;
        const inperson60_5p = fivePlus.p60.inperson + add60;

        if (glanceBadge5Plus) glanceBadge5Plus.textContent = `5+ students • 60 min • ${label}`;
        if (glancePrice5Plus) glancePrice5Plus.textContent = `$${online60_5p} / $${inperson60_5p}`;
        if (glancePer5Plus) {
          glancePer5Plus.textContent = "per 60 minutes (online / in-person • per student)";
        }
      }

      function renderPricing() {
        const badgeYear = document.getElementById("badgeYear");
        const badgeTrack = document.getElementById("badgeTrack");
        const ruleLine = document.getElementById("ruleLine");
        const extraLine = document.getElementById("extraLine");
        const vceBox = document.getElementById("vceBox");

        const y = yearAdj();
        const t = tracks[currentTrack];

        if (currentLevel === "vce") {
          if (vceBox) vceBox.style.display = "block";
          if (badgeYear) badgeYear.textContent = "VCE subject";
        } else {
          if (vceBox) vceBox.style.display = "none";
          if (badgeYear) badgeYear.textContent = adjustments[currentLevel].badge;
        }

        if (badgeTrack) badgeTrack.textContent = t.name;

        const yearText =
          currentLevel === "vce" ? y.label : adjustments[currentLevel].rule;

        if (ruleLine) ruleLine.innerHTML = `${yearText}<br>${t.label}`;
        if (extraLine) {
          extraLine.textContent =
            (currentLevel === "vce"
              ? adjustments.vce.extra
              : adjustments[currentLevel].extra) +
            " " +
            t.extra;
        }

        const add30 = totalAdd30();
        const add60 = totalAdd60();

        priceBody.innerHTML = "";

        pricingRows.forEach((r) => {
          const tr = document.createElement("tr");

          const tdIcon = document.createElement("td");
          tdIcon.className = "icon";
          tdIcon.textContent = r.icon;

          const tdProg = document.createElement("td");
          tdProg.innerHTML = `<div class="program">${r.program}</div>`;

          const td30 = document.createElement("td");
          const force60 = !!r.min60 || tracks[currentTrack].min60;

          if (force60) {
            td30.innerHTML = `
              <div class="locked">
                <div class="label">60-minute minimum</div>
                <div class="small">
                  ${
                    r.min60
                      ? "For 5+ students we only offer 60-minute sessions to keep lesson quality high."
                      : "For this program type, 60-minute sessions are required for best results."
                  }
                </div>
              </div>
            `;
          } else {
            td30.innerHTML = priceCells(r.p30.online + add30, r.p30.inperson + add30);
          }

          const td60 = document.createElement("td");
          td60.innerHTML = priceCells(r.p60.online + add60, r.p60.inperson + add60);

          tr.appendChild(tdIcon);
          tr.appendChild(tdProg);
          tr.appendChild(td30);
          tr.appendChild(td60);
          priceBody.appendChild(tr);
        });

        updateFeesAtGlance();
      }

      document.querySelectorAll("[data-level]").forEach((btn) => {
        btn.addEventListener("click", () => {
          currentLevel = btn.dataset.level;
          document.querySelectorAll("[data-level]").forEach((b) => {
            const active = b.dataset.level === currentLevel;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
          });
          renderPricing();
        });
      });

      document.querySelectorAll("[data-vce]").forEach((btn) => {
        btn.addEventListener("click", () => {
          currentVce = btn.dataset.vce;
          document.querySelectorAll("[data-vce]").forEach((b) => {
            const active = b.dataset.vce === currentVce;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
          });
          renderPricing();
        });
      });

      document.querySelectorAll("[data-track]").forEach((btn) => {
        btn.addEventListener("click", () => {
          currentTrack = btn.dataset.track;
          document.querySelectorAll("[data-track]").forEach((b) => {
            const active = b.dataset.track === currentTrack;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
          });
          renderPricing();
        });
      });

      renderPricing();
    }
  });
})();