/* ============================================================
   LIC Consultant — app.js
   Reads content from main.pjs (root.siteData etc.) with fallbacks,
   then wires: nav/drawer, reveal, counters, policies, calculator,
   video upload, testimonials, FAQ, forms, toasts, modal.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  // ---------- Data (from main.pjs, with safe fallbacks) ----------
  function safe(fn, fb) { try { const v = fn(); return v == null ? fb : v; } catch (e) { return fb; } }
  const SITE = (typeof window !== 'undefined' && window.SITE_CONFIG) || safe(() => root.siteData(), {
    consultantName: "Mahima Sharma",
    designation: "Finance Consultant · LIC & Health Insurance Advisor",
    licenseLine: "IRDAI Licensed Insurance Advisor",
    licenseNo: "IRDAI Lic. No. 23456789",
    phoneDisplay: "+91 79001 00927", phoneTel: "+917900100927",
    whatsapp: "917900100927", email: "mahima.sharma@finconsult.in",
    city: "Mumbai, Maharashtra",
    address: "Ghatkopar West, Mumbai 400086",
    hours: "Mon–Sat · 10:00 AM – 8:00 PM",
    experienceYears: 15,
    whatsappMsg: "Namaste! I found your finance website. I want a FREE 15-min review with Mahima Sharma.",
    videoUrl: "", videoTitle: "Watch: How I help you pick the RIGHT insurance policy in 2 minutes",
    videoNote: "New video every week — best new policy, renewal reminders & claim tips."
  });
  const STATS = (typeof window !== 'undefined' && window.SITE_STATS) || safe(() => root.statsData(), []);
  const POLICIES = (typeof window !== 'undefined' && window.SITE_POLICIES) || safe(() => root.policiesData(), []);
  const FAQS = (typeof window !== 'undefined' && window.SITE_FAQS) || safe(() => root.faqsData(), []);
  const TESTIS = (typeof window !== 'undefined' && window.SITE_TESTIMONIALS) || safe(() => root.testimonialsData(), []);
  const WA = (msg) => "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(msg);

  // ---------- Populate static slots ----------
  function fillText(id, val) { const el = document.getElementById(id); if (el && val) el.textContent = val; }
  fillText("consultantNameEl", SITE.consultantName);
  fillText("consultantNameEl2", SITE.consultantName);
  fillText("consultantNameEl3", SITE.consultantName);
  fillText("consultantNameEl4", SITE.consultantName);
  fillText("designationEl", SITE.designation);
  fillText("licenseEl", SITE.licenseLine + " · " + SITE.licenseNo);
  fillText("cityEl", SITE.city);
  fillText("footNameEl", SITE.consultantName);
  fillText("videoTitleEl", SITE.videoTitle);
  fillText("videoNoteEl", SITE.videoNote);
  fillText("yearEl", String(new Date().getFullYear()));
  $$("[data-phone-display]").forEach((a) => (a.textContent = SITE.phoneDisplay));
  $$('a[data-phone-link]').forEach((a) => (a.href = "tel:" + SITE.phoneTel));
  $$('a[data-wa-link]').forEach((a) => (a.href = WA(a.getAttribute("data-wa-msg") || SITE.whatsappMsg)));
  const mailEl = $("#emailEl"); if (mailEl) { mailEl.textContent = SITE.email; mailEl.href = "mailto:" + SITE.email; }
  fillText("addrEl", SITE.address); fillText("hoursEl", SITE.hours);

  // ---------- Nav ----------
  const nav = $("#navBar"), ham = $("#hamBtn"), drawer = $("#drawer");
  window.addEventListener("scroll", () => {
    nav && nav.classList.toggle("scrolled", window.scrollY > 8);
    const tt = $("#toTopBtn"); if (tt) tt.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    ham && ham.classList.toggle("open", open);
    ham && ham.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  ham && ham.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
  $("#drawerClose") && $("#drawerClose").addEventListener("click", () => setDrawer(false));
  $("#drawerScrim") && $("#drawerScrim").addEventListener("click", () => setDrawer(false));
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setDrawer(false); closeModal(); } });
  $("#toTopBtn") && $("#toTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  // active link highlight
  const secIds = ["home", "policies", "calculator", "video", "reviews", "faq", "contact"];
  const links = $$(".nav-links a");
  const obs = new IntersectionObserver((es) => {
    es.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        $$("#drawer nav a").forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secIds.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });

  // ---------- Reveal ----------
  const robs = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); robs.unobserve(en.target); } }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => robs.observe(el));

  // ---------- Stats counters ----------
  const statGrid = $("#statsGrid");
  if (statGrid && STATS.length) {
    statGrid.innerHTML = STATS.map((s) => `<div class="stat reveal"><b><span data-count="${s.value}">0</span>${s.suffix || ""}</b><span>${s.label}</span><small>${s.sub || ""}</small></div>`).join("");
    $$(".reveal", statGrid).forEach((el) => robs.observe(el));
    const cobs = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return; cobs.unobserve(en.target);
      const target = +en.target.getAttribute("data-count"); const t0 = performance.now(); const dur = 1400;
      (function tick(t) { const p = Math.min(1, (t - t0) / dur); en.target.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN"); if (p < 1) requestAnimationFrame(tick); })(t0);
    }), { threshold: 0.5 });
    $$("[data-count]", statGrid).forEach((el) => cobs.observe(el));
  }

  // ---------- Policies ----------
  const pg = $("#policyGrid");
  if (pg && POLICIES.length) {
    pg.innerHTML = POLICIES.map((p) => `
      <article class="policy reveal">
        <span class="tag ${p.tagKind || "gold"}">${p.tag || ""}</span>
        <div class="plan">${p.plan || ""}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="ideal">✓ Best for: <b>${p.ideal}</b></div>
        <ul>${(p.features || []).map((f) => `<li>${f}</li>`).join("")}</ul>
        <div class="row">
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${WA("Namaste " + SITE.consultantName + " ji! I'm interested in *" + p.name + "* (" + p.plan + "). Please share premium + benefits for my age.")}">WhatsApp Enquiry</a>
          <button class="btn btn-ghost btn-sm" data-review="${p.name}">Free Review</button>
        </div>
      </article>`).join("");
    $$(".reveal", pg).forEach((el) => robs.observe(el));
    $$("[data-review]", pg).forEach((b) => b.addEventListener("click", () => openModal(b.getAttribute("data-review"))));
  }

  // ---------- Calculator ----------
  const age = $("#inAge"), inc = $("#inIncome"), loan = $("#inLoan"), dep = $("#inDep"), have = $("#inHave");
  const ageV = $("#ageV"), incV = $("#incV"), loanV = $("#loanV");
  function fmt(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function calc() {
    if (!age) return;
    const a = +age.value || 30, yearly = (+inc.value || 12) * 100000, loans = (+loan.value || 0) * 100000, cover = (+have.value || 0) * 100000;
    const mult = a < 30 ? 20 : a < 40 ? 15 : a < 50 ? 12 : 10;
    const need = yearly * mult + loans;
    const gap = Math.max(0, need - cover);
    const score = need === 0 ? 100 : Math.max(5, Math.min(100, Math.round((cover / need) * 100)));
    ageV.textContent = a + " yrs"; incV.textContent = "₹" + inc.value + "L/yr"; loanV.textContent = "₹" + loan.value + "L";
    $("#needEl").textContent = fmt(need); $("#gapEl").textContent = fmt(gap); $("#haveEl").textContent = fmt(cover);
    $("#scoreEl").textContent = score;
    $("#scoreBar").style.width = score + "%";
    $("#scoreMsg").textContent = score >= 80 ? "Excellent — you're well protected. Let's do a free bonus/benefit audit." : score >= 50 ? "Halfway there — one smart LIC top-up can close this gap." : "Danger zone — your family cover is far below need. Fix this this month.";
    const cta = $("#calcWa");
    if (cta) cta.href = WA(`FREE Suraksha Check: Age ${a}, Income ₹${inc.value}L, Loans ₹${loan.value}L, Existing cover ₹${have.value}L. My need = ${fmt(need)}, gap = ${fmt(gap)}. Please advise best LIC plan.`);
  }
  [age, inc, loan, dep, have].forEach((el) => el && el.addEventListener("input", calc));
  calc();

  // ---------- Video ----------
  const ytWrap = $("#ytWrap"), upVideo = $("#uploadedVideo"), upInput = $("#videoUpload"), upEmpty = $("#phoneEmpty");
  function ytId(url) { const m = String(url || "").match(/(?:shorts\/|v=|youtu\.be\/)([\w-]{6,})/); return m ? m[1] : ""; }
  const yid = ytId(SITE.videoUrl);
  if (yid && ytWrap) ytWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${yid}?rel=0" title="Consultant intro" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  upInput && upInput.addEventListener("change", () => {
    const f = upInput.files && upInput.files[0]; if (!f) return;
    upVideo.src = URL.createObjectURL(f); upVideo.hidden = false; upEmpty && (upEmpty.style.display = "none");
    upVideo.play().catch(() => {});
  });

  // ---------- Testimonials ----------
  const slides = $("#slides"), dots = $("#dots");
  let ti = 0, timer = null;
  const colors = ["#0b2a5b", "#0e9f6e", "#b8860b", "#7c3aed", "#d64545", "#0e7490"];
  if (slides && TESTIS.length) {
    slides.innerHTML = TESTIS.map((t, i) => `
      <div class="tcard"><div class="tcard-inner">
        <div class="stars">${"★".repeat(t.stars || 5)}${"☆".repeat(5 - (t.stars || 5))}</div>
        <p style="font-size:16px">“${t.text}”</p>
        <div class="who"><span class="avatar" style="background:${colors[i % colors.length]}">${t.initial || t.name[0]}</span>
        <span style="text-align:left"><b>${t.name}</b><br><small style="color:var(--muted)">${t.area}</small></span></div>
      </div></div>`).join("");
    dots.innerHTML = TESTIS.map((_, i) => `<button aria-label="Go to review ${i + 1}" data-i="${i}"></button>`).join("");
    const dotBtns = $$("button", dots);
    function go(n) { ti = (n + TESTIS.length) % TESTIS.length; slides.style.transform = `translateX(-${ti * 100}%)`; dotBtns.forEach((d, k) => d.classList.toggle("on", k === ti)); restart(); }
    function restart() { clearInterval(timer); timer = setInterval(() => go(ti + 1), 5000); }
    dotBtns.forEach((d) => d.addEventListener("click", () => go(+d.getAttribute("data-i"))));
    $("#prevT") && $("#prevT").addEventListener("click", () => go(ti - 1));
    $("#nextT") && $("#nextT").addEventListener("click", () => go(ti + 1));
    let sx = 0; slides.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    slides.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(ti + (dx < 0 ? 1 : -1)); }, { passive: true });
    go(0);
  }

  // ---------- FAQ ----------
  const faqWrap = $("#faqList");
  if (faqWrap && FAQS.length) {
    faqWrap.innerHTML = FAQS.map((f, i) => `
      <div class="faq-item ${i === 0 ? "open" : ""}">
        <button class="faq-q">${f.q}<span class="plus">+</span></button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join("");
    $$(".faq-item", faqWrap).forEach((item) => {
      const btn = $(".faq-q", item), ans = $(".faq-a", item);
      if (item.classList.contains("open")) ans.style.maxHeight = ans.scrollHeight + "px";
      btn.addEventListener("click", () => {
        const open = item.classList.contains("open");
        $$(".faq-item.open", faqWrap).forEach((o) => { o.classList.remove("open"); $(".faq-a", o).style.maxHeight = "0px"; });
        if (!open) { item.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
      });
    });
  }

  // ---------- Lead form -> WhatsApp ----------
  const form = $("#leadForm");
  form && form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#fName").value.trim(), p = $("#fPhone").value.trim(), t = $("#fTopic").value, m = $("#fMsg").value.trim();
    if (!n || !p) { alert("Please enter your name and mobile number."); return; }
    window.open(WA(`Namaste! I'm ${n} (${p}). Topic: ${t}. ${m || "Please call me for a FREE 15-min review."}`), "_blank");
    $("#formOk").hidden = false;
  });

  // ---------- Modal ----------
  const modal = $("#reviewModal");
  function openModal(plan) {
    if (!modal) return;
    const t = $("#mPlan"); if (t && plan) t.textContent = " (" + plan + ")";
    const btn = $("#mWa"); if (btn) btn.href = WA(`Namaste! I want a FREE 15-min LIC review${plan ? " for " + plan : ""}. My name is ______, age __, city ____.`);
    modal.classList.add("open");
  }
  function closeModal() { modal && modal.classList.remove("open"); }
  window.openModal = openModal;
  $$("[data-open-modal]").forEach((b) => b.addEventListener("click", () => openModal(b.getAttribute("data-open-modal") || "")));
  $("#modalClose") && $("#modalClose").addEventListener("click", closeModal);
  $("#modalScrim") && $("#modalScrim").addEventListener("click", closeModal);

  // ---------- Social-proof toasts (the "can't-ignore" nudge) ----------
  const proofs = [
    ["R", "Ramesh from Kurla booked a FREE review", "22 min ago · Term + Health combo"],
    ["S", "Sunita from Thane bought a new LIC policy", "1 hr ago · ₹1 Cr term cover"],
    ["A", "Arif from Andheri started a child plan for his daughter", "3 hrs ago · Child secured"],
    ["M", "Meena from Dadar got maturity credited", "Yesterday · ₹4.2L in 9 days"],
    ["K", "Kavita from Ghatkopar revived a lapsed policy", "2 days ago · Zero penalty"]
  ];
  let pi = 0; const toast = $("#proofToast");
  setInterval(() => {
    if (!toast || document.hidden || proofs.length === 0) return;
    const [i, h, s] = proofs[pi++ % proofs.length];
    $("#proofAv").textContent = i; $("#proofHead").textContent = h; $("#proofSub").textContent = s;
    toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 4200);
  }, 14000);
  setTimeout(() => toast && toast.classList.add("show"), 6000);
  setTimeout(() => toast && toast.classList.remove("show"), 10500);
  // ---------- End ----------
})();
