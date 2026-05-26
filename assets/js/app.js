(function () {
  const app = document.getElementById("app");
  const nav = document.getElementById("main-nav");
  const footer = document.getElementById("footer-content");
  const langToggle = document.getElementById("lang-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const brand = document.getElementById("brand");
  const site = window.siteContent;
  const state = {
    lang: localStorage.getItem("bb-lang") || "no",
    employeeUnlocked: false,
    navOpen: false
  };

  function currentPage() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return site.pages.find((page) => page.slug === hash) || site.pages[0];
  }

  function copy() {
    return site.content[state.lang];
  }

  function pageCopy(key) {
    return copy()[key];
  }

  function pageLabel(page) {
    return state.lang === "no" ? page.navNo : page.navEn;
  }

  function updateMeta(page) {
    const languageCopy = copy();
    const title = languageCopy.pageTitles[page.key] || `${pageCopy(page.key).title} | Barents Buss`;
    const description = languageCopy.meta[page.key] || site.defaultDescription;
    document.title = title;
    setMeta("description", description);
    setMeta("robots", "index, follow, max-image-preview:large");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${site.siteUrl}${page.slug ? `#/${page.slug}` : ""}`, "property");
    setMeta("og:image:alt", site.heroImageAlt, "property");
  }

  function setMeta(name, content, attribute = "name") {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  function renderBrand() {
    brand.innerHTML = `<img src="${site.logo}" alt="Barents Buss logo"><span>Barents Buss</span>`;
  }

  function renderNav() {
    const activePage = currentPage();
    nav.innerHTML = site.pages
      .map((page) => {
        const active = activePage.key === page.key ? " active" : "";
        return `<a class="nav-link${active}" href="#/${page.slug}">${pageLabel(page)}</a>`;
      })
      .join("");
    nav.classList.toggle("open", state.navOpen);
    navToggle.setAttribute("aria-expanded", String(state.navOpen));
  }

  function paragraphs(lines) {
    return lines.map((line) => `<p>${line}</p>`).join("");
  }

  function heroSection(data, image = site.sectionImage) {
    return `
      <section class="page-hero">
        <div class="page-hero-copy">
          <span class="eyebrow">${data.kicker}</span>
          <h1>${data.title}</h1>
          <p class="lead">${data.lead}</p>
        </div>
        <img class="page-hero-image" src="${image}" alt="Barents Buss">
      </section>
    `;
  }

  function renderHome(data) {
    return `
      <section class="home-hero">
        <div class="home-hero-copy">
          <span class="eyebrow">${data.kicker}</span>
          <h1>${data.title}</h1>
          <p class="lead">${data.lead}</p>
          <div class="hero-actions">
            <a class="btn primary" href="#/kontakt">${copy().ctaContact}</a>
            <a class="btn secondary" href="#/flybuss">${copy().ctaAirport}</a>
          </div>
        </div>
        <div class="home-hero-media">
          <div class="hero-image-frame">
            <img class="home-hero-image" src="${site.heroImage}" alt="Barents Buss på tur">
          </div>
          <div class="hero-badge">
            <span>${state.lang === "no" ? "Bestilling 24-7" : "Booking 24/7"}</span>
            <strong>${site.contact.phoneCompact}</strong>
          </div>
        </div>
      </section>
      <section class="intro-band">
        <div class="container intro-grid">
          <div>${paragraphs(data.body)}</div>
          <a class="contact-panel" href="tel:${site.contact.phoneHref}">
            <span>${state.lang === "no" ? "Bestilling 24-7" : "Booking 24/7"}</span>
            <strong>${site.contact.phoneCompact}</strong>
          </a>
        </div>
      </section>
      <section class="container highlight-grid">
        ${data.highlights
          .map(
            (item) => `
              <a class="highlight-card" href="${item.href}">
                <h2>${item.title}</h2>
                <p>${item.text}</p>
              </a>
            `
          )
          .join("")}
      </section>
    `;
  }

  function renderAbout(data) {
    return `
      <div class="container page-stack">
        ${heroSection(data)}
        <section class="text-panel wide-text">${paragraphs(data.body)}</section>
      </div>
    `;
  }

  function renderServices(data) {
    return `
      <div class="container page-stack">
        ${heroSection(data, "assets/images/cropped-cropped-forside.jpg")}
        <section class="split-section">
          <div class="text-panel">${paragraphs(data.body)}<p class="booking-line">${data.booking}</p></div>
          <div class="fleet-list">
            <h2>${data.listTitle}</h2>
            <ul>${data.list.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </section>
      </div>
    `;
  }

  function renderSchedule(data) {
    const rows = data.schedule
      .map((row) => {
        if (row.group) {
          return `<tr class="schedule-group"><th colspan="3">${row.group}</th></tr>`;
        }
        return `<tr><th scope="row">${row.stop}</th><td>${row.morning}</td><td>${row.evening}</td></tr>`;
      })
      .join("");

    return `
      <div class="container page-stack">
        ${heroSection(data, site.heroImage)}
        <section class="schedule-section">
          <div class="schedule-scroll">
            <table>
              <thead>
                <tr>
                  ${data.scheduleHeaders.map((header) => `<th scope="col">${header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <div class="schedule-note">
            <p>${data.note}</p>
            <strong>${data.welcome}</strong>
          </div>
        </section>
      </div>
    `;
  }

  function renderContact(data) {
    return `
      <div class="container page-stack">
        ${heroSection(data, "assets/images/footer-image.jpg")}
        <section class="contact-layout">
          <div class="text-panel">
            <h2>${data.locationTitle}</h2>
            ${paragraphs(data.body)}
          </div>
          <div class="contact-actions">
            <a class="btn primary" href="tel:${site.contact.phoneHref}">${site.contact.phone}</a>
            <a class="btn secondary" href="mailto:${site.contact.email}">${site.contact.email}</a>
            <a class="btn neutral" href="${site.contact.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </section>
      </div>
    `;
  }

  function renderGallery(data) {
    return `
      <div class="container page-stack">
        ${heroSection(data, "assets/images/Santa_park_Rovaniemi-DSC_0324.jpg")}
        <section class="media-section">
          <div class="video-placeholder">
            <span>${data.videoTitle}</span>
          </div>
          <div>
            <h2>${data.galleryTitle}</h2>
            <div class="gallery-grid">
              ${site.galleryImages
                .map(
                  (image) => `
                    <figure>
                      <img src="${image.src}" alt="${state.lang === "no" ? image.altNo : image.altEn}">
                    </figure>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderEmployees(data) {
    if (!state.employeeUnlocked) {
      return `
        <div class="container page-stack compact">
          ${heroSection(data)}
          <section class="employee-panel">
            <form id="employee-form" class="employee-form">
              <label for="employee-password">${data.passwordLabel}</label>
              <div class="password-row">
                <input id="employee-password" type="password" required autocomplete="current-password">
                <button class="btn primary" type="submit">${data.unlock}</button>
              </div>
              <p class="feedback" id="employee-feedback" aria-live="polite"></p>
            </form>
          </section>
        </div>
      `;
    }

    return `
      <div class="container page-stack compact">
        ${heroSection(data)}
        <section class="employee-panel">
          <iframe
            class="employee-document"
            title="${data.openDocument}"
            src="${site.employeeDocumentUrl}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <p class="employee-document-fallback">
            <a target="_blank" rel="noopener noreferrer" href="${site.employeeDocumentUrl}">${data.openDocument}</a>
          </p>
        </section>
      </div>
    `;
  }

  function bindEmployeeForm() {
    const form = document.getElementById("employee-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = document.getElementById("employee-password").value;
      if (password === site.employeePassword) {
        state.employeeUnlocked = true;
        render();
        return;
      }
      document.getElementById("employee-feedback").textContent = pageCopy("employees").incorrect;
    });
  }

  function renderPage() {
    const page = currentPage();
    const data = pageCopy(page.key);
    updateMeta(page);

    const renderers = {
      home: renderHome,
      about: renderAbout,
      services: renderServices,
      airport: renderSchedule,
      contact: renderContact,
      gallery: renderGallery,
      employees: renderEmployees
    };

    app.innerHTML = renderers[page.key](data);
    bindEmployeeForm();
  }

  function renderFooter() {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="${site.logo}" alt="Barents Buss logo">
          <p>${copy().footer}</p>
        </div>
        <div>
          <strong>${site.contact.phone}</strong>
          <a href="mailto:${site.contact.email}">${site.contact.email}</a>
          <span>${site.contact.address}</span>
        </div>
      </div>
    `;
  }

  function render() {
    document.documentElement.lang = state.lang === "no" ? "no" : "en";
    langToggle.textContent = state.lang === "no" ? "EN" : "NO";
    nav.setAttribute("aria-label", state.lang === "no" ? "Hovedmeny" : "Main menu");
    renderBrand();
    renderNav();
    renderPage();
    renderFooter();
  }

  langToggle.addEventListener("click", () => {
    state.lang = state.lang === "no" ? "en" : "no";
    localStorage.setItem("bb-lang", state.lang);
    render();
  });

  navToggle.addEventListener("click", () => {
    state.navOpen = !state.navOpen;
    renderNav();
  });

  nav.addEventListener("click", () => {
    state.navOpen = false;
    renderNav();
  });

  window.addEventListener("hashchange", () => {
    state.navOpen = false;
    render();
  });

  if (!window.location.hash) window.location.hash = "#/";
  render();
})();
