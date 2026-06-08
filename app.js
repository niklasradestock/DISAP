
const shops = [
  ["Café Südplatz","☕","Kaffee, Frühstück und Kuchen in Leipzig",["2x Punkte heute","0,4 km"],340,"café südplatz gastronomie kaffee"],
  ["Bäckerei Krone","🥐","Regionale Backwaren und Snacks",["Coupon aktiv","0,8 km"],190,"bäckerei krone lebensmittel bäcker"],
  ["Flora Werkstatt","🌿","Blumen, Pflanzen und Geschenkideen",["Neu dabei","1,1 km"],85,"flora werkstatt einzelhandel blumen"],
  ["Bar Acht","🍸","Drinks, Events und Wochenaktionen",["9 kaufen, 1 gratis","1,6 km"],520,"bar acht nachtleben drinks"],
  ["Kino Passage","🎬","Kultur, Filmabende und lokale Events",["Prämien verfügbar","2,2 km"],145,"kino passage kultur freizeit"]
];

const mapData = {
  "Museum am Markt":["Museum am Markt","Sonderausstellung heute. Gratis Eintritt ab 1.000 DISAP Punkten.","100 Punkte","0,7 km","Museum"],
  "Kino Passage":["Kino Passage","Heute 20:15 Uhr. Sammle beim Ticketkauf 80 DISAP Punkte.","80 Punkte","1,2 km","Kultur"],
  "Galerie West":["Galerie West","Galerie Abend ab 18:00 Uhr. 2x Punkte auf Getränke.","2x Punkte","2,0 km","Galerie"],
  "Theater Loft":["Theater Loft","Open Stage mit aktivem Studierenden Coupon.","Coupon","1,8 km","Theater"],
  "Club Kulturhof":["Club Kulturhof","Live Session am Abend. Punkte sammeln am Einlass.","Punkte","2,4 km","Musik"],
  "Stadtbibliothek":["Stadtbibliothek","Lesung und Kulturprogramm mit DISAP Vorteil.","40 Punkte","0,9 km","Lesung"]
};

class DemoApp {
  constructor(root) {
    this.root = root;
    this.view = location.hash.replace("#","") || "home";
    this.nav = [
      ["home","⌂","Start"],
      ["radar","⌖","Radar"],
      ["announcements","📢","Ankünd."],
      ["qr","▣","QR"],
      ["profile","◌","Profil"]
    ];
  }

  init() {
    window.addEventListener("hashchange", () => {
      this.view = location.hash.replace("#","") || "home";
      this.render();
    });
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <main class="shell">
        ${this.header()}
        <section>${this.page()}</section>
        ${this.navigation()}
      </main>
    `;
    this.bind();
  }

  header() {
    const copy = {
      home:["Hallo, Niklas 👋","Entdecke teilnehmende Shops in deiner Nähe und behalte deine Punkte im Blick."],
      radar:["Aktionsradar","Finde kulturelle Angebote in deiner Nähe, sammle Punkte und entdecke aktuelle Events teilnehmender DISAP Partner."],
      announcements:["Ankündigungen","Offizielle Informationen, Umfragen und Events der Stadt Leipzig direkt in der DISAP App."],
      qr:["Dein QR Code","Zeige deinen persönlichen DISAP Code zum Sammeln, Einlösen und später auch zum Bezahlen."],
      profile:["Profil","Verwalte dein Benutzerkonto, deine Einstellungen und deine bevorzugten DISAP Funktionen."]
    };
    const [title,text] = copy[this.view] || copy.home;
    return `
      <header class="header">
        <div class="brand">
          <div>
            <div class="logo">DISAP</div>
            <div class="sub">Der digitale Sammelpass</div>
          </div>
          <div class="profile">NR</div>
        </div>
        <div class="headtext"><h1>${title}</h1><p>${text}</p></div>
      </header>
    `;
  }

  navigation() {
    return `<nav class="nav">${this.nav.map(([id,icon,label]) => `
      <button class="${this.view===id ? "active" : ""}" data-view="${id}">
        <span>${icon}</span>${label}
      </button>`).join("")}</nav>`;
  }

  page() {
    if (this.view === "radar") return new RadarView().render();
    if (this.view === "announcements") return new AnnouncementsView().render();
    if (this.view === "qr") return new QRView().render();
    if (this.view === "profile") return new ProfileView().render();
    return new HomeView().render();
  }

  bind() {
    document.querySelectorAll(".nav button").forEach(btn => btn.addEventListener("click", () => location.hash = btn.dataset.view));
    if (this.view === "home") HomeView.bind();
    if (this.view === "radar") RadarView.bind();
    if (this.view === "announcements") AnnouncementsView.bind();
  }
}

class HomeView {
  renderShop(shop) {
    const [name,icon,desc,tags,points,search] = shop;
    return `<article class="shop" data-search="${search}">
      <div class="ico">${icon}</div>
      <div>
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="meta">${tags.map((t,i)=>`<span class="pill ${i===0?"a":""}">${t}</span>`).join("")}</div>
      </div>
      <div class="sp">${points}<small>Punkte</small></div>
    </article>`;
  }

  render() {
    return `<div class="grid2">
      <div>
        <section class="section">
          <div class="points">
            <div class="ptop"><div><div class="muted">Dein Punktekonto</div><strong>Alle DISAP Punkte</strong></div><div class="badge">Aktiv</div></div>
            <div class="num">1.280</div>
            <p>Noch 220 Punkte bis zur nächsten Prämie.</p>
            <div class="progress"><span></span></div>
          </div>
          <div class="quick"><button data-qr>QR zeigen</button><button>Coupons</button><button>Historie</button></div>
        </section>
        <section class="section">
          <div class="row"><h2>Dein QR-Code</h2></div>
          <div class="scan"><div><h3>Beim Einkauf scannen lassen</h3><p>Nutze deinen persönlichen Code zum Sammeln, Einlösen und später auch zum Bezahlen.</p></div><div class="qr"></div></div>
        </section>
        <section class="section">
          <div class="row"><h2>Aktueller Vorteil</h2></div>
          <div class="coupon"><div><h3>Gratis Kaffee</h3><p>Einlösbar ab 1.500 Punkten bei teilnehmenden Cafés.</p></div><button class="primary">Einlösen</button></div>
        </section>
      </div>
      <div>
        <section class="section">
          <div class="row"><h2>Teilnehmende Shops</h2><a href="#radar">Aktionsradar öffnen</a></div>
          <div class="search"><input id="shopSearch" placeholder="Shop, Branche oder Ort suchen"><button>Suchen</button></div>
          <div class="shops" id="shopList">${shops.map(this.renderShop).join("")}</div>
        </section>
      </div>
    </div>`;
  }

  static bind() {
    const input = document.getElementById("shopSearch");
    const filter = () => {
      const s = (input.value || "").toLowerCase().trim();
      document.querySelectorAll(".shop").forEach(el => {
        const t = (el.dataset.search + " " + el.innerText).toLowerCase();
        el.style.display = t.includes(s) ? "grid" : "none";
      });
    };
    input?.addEventListener("input", filter);
    document.querySelector("[data-qr]")?.addEventListener("click", () => location.hash = "qr");
  }
}

class RadarView {
  renderEvent(d,m,t,p) {
    return `<article class="event"><div class="etop"><div><h3>${t}</h3><p>${p}</p></div><div class="date">${d}<small>${m}</small></div></div><div><button class="primary">Anzeigen</button> <button class="secondary">Merken</button></div></article>`;
  }

  render() {
    const pins = Object.keys(mapData).map((title,i)=>`<button class="pin p${i+1}" title="${title}"><span>${["🏛","🎬","🖼","🎭","🎵","📚"][i]}</span></button>`).join("");
    return `<section class="gridmap">
      <div class="panel">
        <div class="toolbar"><input placeholder="Kulturangebot oder Ort suchen"><button class="chip active">Alle</button><button class="chip">Museum</button><button class="chip">Kino</button><button class="chip">Event</button></div>
        <div class="map">
          <div class="river"></div><div class="street s1"></div><div class="street s2"></div><div class="street s3"></div><div class="street s4"></div><div class="street s5"></div>
          ${pins}
          <div class="tip" id="tip"><h3>Kino Passage</h3><p>Heute 20:15 Uhr. Sammle beim Ticketkauf 80 DISAP Punkte.</p><div class="meta"><span class="pill a">80 Punkte</span><span class="pill">1,2 km</span><span class="pill">Kultur</span></div></div>
        </div>
      </div>
      <aside class="panel">
        <div class="ph"><h2>Events im Raum</h2><p>Aktuelle Veranstaltungen teilnehmender DISAP Partner in deiner Umgebung.</p></div>
        <div class="events">
          ${this.renderEvent("08","JUN","Filmabend im Kino Passage","20:15 Uhr · 1,2 km entfernt · 80 Punkte beim Ticketkauf")}
          ${this.renderEvent("09","JUN","Sonderausstellung im Museum","Ganztägig · 0,7 km entfernt · Gratis Eintritt ab 1.000 Punkten")}
          ${this.renderEvent("10","JUN","Galerie Abend West","18:00 Uhr · 2,0 km entfernt · 2x Punkte auf Getränke")}
          ${this.renderEvent("12","JUN","Open Stage im Theater Loft","19:30 Uhr · 1,8 km entfernt · Coupon für Studierende aktiv")}
        </div>
      </aside>
    </section>`;
  }

  static bind() {
    document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
    }));
    document.querySelectorAll(".pin").forEach(pin => pin.addEventListener("click", () => {
      const x = mapData[pin.title];
      document.getElementById("tip").innerHTML = `<h3>${x[0]}</h3><p>${x[1]}</p><div class="meta"><span class="pill a">${x[2]}</span><span class="pill">${x[3]}</span><span class="pill">${x[4]}</span></div>`;
    }));
  }
}

class AnnouncementsView {
  cat(icon,title,text,active=false){return `<div class="cat ${active?"active":""}"><div class="catico">${icon}</div><div><h4>${title}</h4><p class="muted">${text}</p></div></div>`}
  option(name,value){return `<div class="option"><div class="otop"><span>${name}</span><span>${value}%</span></div><div class="bar"><span style="width:${value}%"></span></div></div>`}
  render() {
    return `<section class="grid3">
      <aside class="panel hide-mobile">
        <div class="ph"><h2>Stadtkanal</h2><p>Kommunale Inhalte für Bürgerinnen, Bürger und lokale DISAP Nutzer.</p></div>
        <div class="city">
          <div class="citylogo"><div class="seal">🏛</div><div><h3>Stadt Leipzig</h3><p>Offizieller DISAP Partner</p></div></div>
          ${this.cat("📢","Alle Beiträge","Infos, Events, Umfragen",true)}
          ${this.cat("ℹ️","Informationen","Neuigkeiten der Kommune")}
          ${this.cat("📊","Umfragen","Meinung teilen")}
          ${this.cat("🎪","Events","Veranstaltungen im Raum")}
        </div>
      </aside>
      <main class="panel">
        <div class="toolbar"><input id="annSearch" placeholder="Ankündigung, Thema oder Event suchen"><button class="chip active" data-filter="all">Alle</button><button class="chip" data-filter="info">Infos</button><button class="chip" data-filter="survey">Umfragen</button><button class="chip" data-filter="event">Events</button></div>
        <div class="feed">
          <article class="post" data-type="info" data-search="innenstadt mobilität baustelle information">
            <div class="posttop"><div class="author"><div class="avatar">🏛</div><div><h3>Stadt Leipzig</h3><p>Heute · Offizielle Information</p></div></div><span class="tag info">Information</span></div>
            <h2>Neue Mobilitätszone in der Innenstadt</h2><p>Ab nächster Woche wird in Teilen der Innenstadt eine neue Verkehrsführung getestet. Fußwege, Radwege und Lieferzonen sollen dadurch übersichtlicher werden.</p>
            <div class="meta"><span class="pill">Innenstadt</span><span class="pill">Mobilität</span><span class="pill">Gültig ab Montag</span></div><div><button class="primary">Details ansehen</button> <button class="secondary">Merken</button></div>
          </article>
          <article class="post" data-type="survey" data-search="umfrage innenstadt kultur angebot befragung">
            <div class="posttop"><div class="author"><div class="avatar">🏛</div><div><h3>Stadt Leipzig</h3><p>Gestern · Bürgerumfrage</p></div></div><span class="tag survey">Umfrage</span></div>
            <h2>Welche Kulturangebote wünscht du dir häufiger?</h2><p>Die Stadt Leipzig möchte lokale Kulturangebote besser auf die Interessen der Bürgerinnen und Bürger abstimmen.</p>
            <div class="survey">${this.option("Open Air Kino",42)}${this.option("Konzerte im Park",35)}${this.option("Stadtteilfeste",23)}</div><div><button class="primary">Abstimmen</button> <button class="secondary">Teilen</button></div>
          </article>
          <article class="post" data-type="event" data-search="event stadtfest leipzig wochenende markt musik">
            <div class="posttop"><div class="author"><div class="avatar">🏛</div><div><h3>Stadt Leipzig</h3><p>Vor 2 Tagen · Veranstaltung</p></div></div><span class="tag event">Event</span></div>
            <h2>Stadtteilfest am Wochenende</h2><p>Lokale Händler, Gastronomie, Musik und Kulturangebote nehmen am kommenden Wochenende am Stadtteilfest teil. DISAP Partner bieten zusätzliche Punkteaktionen an.</p>
            <div class="eventcard"><div><h3>Leipziger Stadtteilfest</h3><p>Samstag · 12:00 bis 22:00 Uhr · Zentrum Süd</p></div><div class="date">15<small>JUN</small></div></div><div><button class="primary">Event anzeigen</button> <button class="secondary">Zum Kalender</button></div>
          </article>
        </div>
      </main>
      <aside class="panel">
        <div class="ph"><h2>Aktuell wichtig</h2><p>Schneller Überblick über laufende Beiträge der Kommune.</p></div>
        <div class="sidebody"><div class="compact"><h3>3 neue Beiträge</h3><p>Heute veröffentlicht</p></div><div class="compact"><span class="tag survey">Umfrage läuft</span><h3>Kulturangebote in Leipzig</h3><p>Noch 5 Tage abstimmen.</p></div><div class="compact"><span class="tag event">Nächstes Event</span><h3>Stadtteilfest Zentrum Süd</h3><p>Samstag ab 12:00 Uhr.</p></div></div>
      </aside>
    </section>`;
  }
  static bind() {
    const chips = document.querySelectorAll(".toolbar .chip");
    const input = document.getElementById("annSearch");
    const filter = () => {
      const active = document.querySelector(".toolbar .chip.active")?.dataset.filter || "all";
      const s = (input.value || "").toLowerCase().trim();
      document.querySelectorAll(".post").forEach(p => {
        const typeOk = active === "all" || p.dataset.type === active;
        const textOk = (p.dataset.search + " " + p.innerText).toLowerCase().includes(s);
        p.style.display = typeOk && textOk ? "grid" : "none";
      });
    };
    chips.forEach(c=>c.addEventListener("click",()=>{chips.forEach(x=>x.classList.remove("active"));c.classList.add("active");filter()}));
    input?.addEventListener("input", filter);
  }
}

class QRView {
  render(){return `<section class="grid2"><div class="panel"><div class="ph"><h2>Persönlicher QR Code</h2><p>Dieser Bereich kann später für Sammeln, Einlösen und Mobile Payment genutzt werden.</p></div><div class="section"><div class="scan"><div><h3>DISAP Code</h3><p>Beim teilnehmenden Unternehmen vorzeigen und Punkte sammeln.</p></div><div class="qr"></div></div></div></div><div class="panel"><div class="ph"><h2>Letzte Aktivitäten</h2><p>Beispielhafte Transaktionen deines Kontos.</p></div><div class="events"><article class="event"><h3>Café Südplatz</h3><p>+80 Punkte · Heute</p></article><article class="event"><h3>Kino Passage</h3><p>+145 Punkte · Gestern</p></article><article class="event"><h3>Bäckerei Krone</h3><p>Coupon eingelöst · Montag</p></article></div></div></section>`}
}

class ProfileView {
  render(){return `<section class="grid2"><div class="panel"><div class="ph"><h2>Benutzerprofil</h2><p>Grunddaten für die Demo Sicht des Endanwenders.</p></div><div class="sidebody"><div class="compact"><h3>Name</h3><p>Niklas Radestock</p></div><div class="compact"><h3>Status</h3><p>Aktives DISAP Konto</p></div><div class="compact"><h3>Punkte</h3><p>1.280 Punkte gesammelt</p></div></div></div><div class="panel"><div class="ph"><h2>Einstellungen</h2><p>Beispielhafte App Einstellungen.</p></div><div class="sidebody"><div class="compact"><h3>Push Benachrichtigungen</h3><p>Aktiviert für Coupons, Events und Stadtankündigungen.</p></div><div class="compact"><h3>Standortdienste</h3><p>Aktiviert für Aktionsradar und lokale Angebote.</p></div><div class="compact"><h3>Datenschutz</h3><p>Einwilligungen und Datenfreigaben verwalten.</p></div></div></div></section>`}
}

new DemoApp(document.getElementById("app")).init();
