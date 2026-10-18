/* Trivia Black deep-link fallback (/g/, /u/, /d/, /i/), shown when the app isn't installed.
   The app claims these paths (universal links / app links); a browser only lands here without it.
   Same rules as TriviaBlack.Contracts.AppLinks in the platform repo (docs/DEEP-LINKS.md):
     /g/{matchupId}   open that game        /u/{username}  challenge a player
     /d/{deck|topic}  open a deck / topic   /i/{code}      invite (referral code, reserved)
   Each path also works as /g/?id={value}: g/index.html etc. serve that form on any static host,
   and 404.html (plus a snippet in index.html) serves the pretty form wherever the host falls back. */
(function () {
  "use strict";

  var APP_STORE = "https://apps.apple.com/us/app/trivia-black/id1476178356";
  var APPLE_PT = "118186768"; // App Store Connect provider token (same as the campaign pages)
  var PLAY = "https://play.google.com/store/apps/details?id=com.swyftstudios.trivia_black";
  var SCHEME = "triviablack://";

  function decode(s) {
    try { return decodeURIComponent(String(s).replace(/\+/g, " ")); } catch (e) { return String(s); }
  }

  function parse(loc) {
    var m = /^\/([gudi])(?:\/([^\/?#]*))?/i.exec(loc.pathname);
    if (!m) return null;
    var kind = m[1].toLowerCase();
    var raw = m[2] && m[2].toLowerCase() !== "index.html" ? m[2] : null;
    if (!raw) {
      var q = /[?&]id=([^&#]*)/i.exec(loc.search);
      raw = q ? q[1] : null;
    }
    if (!raw) return null;
    var v = decode(raw).trim();
    var guid = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
    if (kind === "g") return guid.test(v) ? { kind: kind, value: v.replace(/-/g, "").toLowerCase() } : null;
    if (kind === "u") {
      v = v.replace(/^@/, "").toLowerCase();
      return /^[a-z0-9_.]{3,20}$/.test(v) ? { kind: kind, value: v } : null;
    }
    if (kind === "d") {
      if (guid.test(v)) return { kind: kind, value: v.replace(/-/g, "").toLowerCase(), id: true };
      v = v.replace(/\s+/g, " ").toLowerCase();
      return v.length <= 80 && /^[a-z0-9][a-z0-9 '&-]*$/.test(v) ? { kind: kind, value: v } : null;
    }
    return /^[A-Za-z0-9_-]{1,32}$/.test(v) ? { kind: "i", value: v } : null;
  }

  function titleCase(s) {
    return s.replace(/(^|[\s-])([a-z])/g, function (_, a, b) { return a + b.toUpperCase(); });
  }

  var COPY = {
    g: function () { return { eyebrow: "Your game is waiting", title: "It might be your turn!", lede: "Open Trivia Black to see the game and play your turn. New here? Get the free app, then tap the link again." }; },
    u: function (l) { return { eyebrow: "Head-to-head trivia", title: "Challenge @" + l.value, lede: "Think you know the culture better than @" + l.value + "? Open Trivia Black to start a game. New here? Get the free app first." }; },
    d: function (l) { return { eyebrow: "Trivia Black topic", title: l.id ? "A new topic is waiting" : "Play " + titleCase(l.value), lede: "Open Trivia Black to play this topic solo. New here? Get the free app, then tap the link again." }; },
    i: function () { return { eyebrow: "You're invited", title: "Come play Trivia Black", lede: "A friend wants to play. Get the free app, make your account and challenge them head-to-head." }; },
    bad: function () { return { eyebrow: "Trivia Black", title: "This link doesn't look right", lede: "It may have been cut off. Ask for a new link, or get the app and play from there." }; }
  };

  function storeLinks(link) {
    var campaign = link ? "dl-" + link.kind : "dl-bad";
    var ct = link && link.kind === "i" ? ("invite-" + link.value).slice(0, 40) : campaign;
    var referrer = "utm_source=triviablack.com&utm_medium=deeplink&utm_campaign=" + campaign
      + (link && link.kind === "i" ? "&utm_content=" + encodeURIComponent(link.value) : "");
    return {
      apple: APP_STORE + "?pt=" + APPLE_PT + "&ct=" + encodeURIComponent(ct) + "&mt=8",
      play: PLAY + "&referrer=" + encodeURIComponent(referrer)
    };
  }

  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  function render() {
    var link = parse(window.location);
    var copy = (link ? COPY[link.kind] : COPY.bad)(link);
    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var android = /Android/.test(ua);

    document.getElementById("dl-eyebrow").textContent = copy.eyebrow;
    document.getElementById("dl-title").textContent = copy.title;
    document.getElementById("dl-lede").textContent = copy.lede;
    document.title = copy.title + " | Trivia Black";

    var stores = storeLinks(link);
    var apple = document.getElementById("dl-apple");
    var play = document.getElementById("dl-play");
    apple.href = stores.apple;
    play.href = stores.play;
    // The App Store button comes first in the markup; Android visitors see Google Play first.
    if (android) apple.parentNode.insertBefore(play, apple);

    var open = document.getElementById("dl-open");
    if (link && (ios || android)) {
      var target = SCHEME + link.kind + "/" + encodeURIComponent(link.value);
      open.href = target;
      open.hidden = false;
      open.addEventListener("click", function () {
        track("deep_link_open_app", { link_kind: link.kind });
        // Still here after a moment: the app isn't installed, so point at the store.
        setTimeout(function () {
          if (!document.hidden) document.getElementById("dl-get").classList.add("dl-nudge");
        }, 1600);
      });
    }

    // Safari's banner can hand the link to an installed app (it arrives as openURL).
    var banner = document.querySelector('meta[name="apple-itunes-app"]');
    if (banner && link) banner.setAttribute("content", "app-id=1476178356, app-argument=" + window.location.href);

    [apple, play].forEach(function (a) {
      a.addEventListener("click", function () { track("deep_link_store_click", { link_kind: link ? link.kind : "bad", store: a === apple ? "app_store" : "google_play" }); });
    });
    track("deep_link_fallback", { link_kind: link ? link.kind : "bad" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
