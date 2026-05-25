(function () {
  const app = document.getElementById("app");
  const nav = document.getElementById("main-nav");
  const footer = document.getElementById("footer-content");
  const langToggle = document.getElementById("lang-toggle");
  const brand = document.getElementById("brand");
  const state = { lang: localStorage.getItem("bb-lang") || "no", employeeUnlocked: false };
  const site = window.siteContent;

  function keyFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return (site.pages.find((p) => p.slug === hash) || site.pages[0]).key;
  }
  const t = () => site.content[state.lang];

  function renderNav() {
    nav.innerHTML = site.pages.map((p) => `<a class="${keyFromHash()===p.key?'active':''}" href="#/${p.slug}">${state.lang==='no'?p.navNo:p.navEn}</a>`).join("");
  }

  function employeeView(copy) {
    if (!state.employeeUnlocked) {
      return `<section class="card"><h1>${copy.title}</h1><p class="lead">${copy.lead}</p><p>${copy.body[0]}</p><form id="employee-form" class="employee-form"><input id="employee-password" type="password" required placeholder="${state.lang==='no'?'Passord':'Password'}"><button>${state.lang==='no'?'Lås opp':'Unlock'}</button></form><p class="feedback" id="employee-feedback"></p></section>`;
    }
    return `<section class="card"><h1>${copy.title}</h1><p class="lead">${copy.lead}</p><a class="btn" target="_blank" rel="noopener noreferrer" href="${site.employeeDocumentUrl}">${state.lang==='no'?'Åpne dokument':'Open document'}</a></section>`;
  }

  function renderPage() {
    const key = keyFromHash();
    const copy = t()[key];
    if (key === "employees") {
      app.innerHTML = employeeView(copy);
      const form = document.getElementById("employee-form");
      if (form) form.addEventListener("submit", (e) => { e.preventDefault(); const ok = document.getElementById("employee-password").value === site.employeePassword; if (ok) { state.employeeUnlocked = true; render(); } else { document.getElementById("employee-feedback").textContent = state.lang==='no'?'Feil passord.':'Incorrect password.'; } });
      return;
    }

    const list = copy.list ? `<ul>${copy.list.map((x)=>`<li>${x}</li>`).join("")}</ul>` : "";
    const cta = key==="home" ? `<div class="actions"><a class="btn" href="#/turbuss">${t().ctaReadMore}</a><a class="btn ghost" href="#/kontakt">${t().ctaContact}</a></div>` : "";
    const facebook = key==="contact" ? `<p><a href="${copy.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a></p>` : "";
    const gallery = key==="gallery" ? `<div class="gallery">${site.galleryImages.map((src)=>`<img src="${src}" alt="Barents Buss">`).join("")}</div>` : `<img class="section-image" src="${site.sectionImage}" alt="Barents Buss">`;

    app.innerHTML = `<section class="hero"><img class="hero-image" src="${site.heroImage}" alt="Barents Buss"><div><h1>${copy.title}</h1><p class="lead">${copy.lead}</p>${cta}</div></section><section class="card">${copy.body.map((p)=>`<p>${p}</p>`).join("")}${list}${facebook}</section>${gallery}`;
  }

  function render() {
    document.documentElement.lang = state.lang === "no" ? "no" : "en";
    brand.innerHTML = `<img src="${site.logo}" alt="Barents Buss logo">`;
    langToggle.textContent = state.lang === "no" ? "EN" : "NO";
    renderNav();
    renderPage();
    footer.innerHTML = `<p>${t().footer}</p><img class="footer-image" src="${site.footerImage}" alt="Barents Buss">`;
  }

  langToggle.addEventListener("click", () => { state.lang = state.lang === "no" ? "en" : "no"; localStorage.setItem("bb-lang", state.lang); render(); });
  window.addEventListener("hashchange", render);
  if (!window.location.hash) window.location.hash = "#/";
  render();
})();
