# triviablack.com

Static site for [Trivia Black](https://apps.apple.com/us/app/trivia-black/id1476178356) by Swyft Studios LLC: landing page, support, privacy policy, terms and account deletion. Deployed to GitHub Pages by `.github/workflows/pages.yml`.

The store listings and the apps link to `privacy_policy.html`, `terms_and_conditions.html` and `account-deletion.html`, and `support.html` is the store Support URL, so keep those file names stable.

## Pages

- `index.html`: landing page (game, what's new, live events, deck sponsorship). Styles: `css/legal.css` (shared base) plus `css/site.css`.

Preview locally: `C:/Python313/python.exe -m http.server 8765 --bind 127.0.0.1 --directory C:/tbwt/triviablack-site`, then open http://localhost:8765/.

## Deep links (app 3.2)

The app claims `/g/` (game), `/u/` (player), `/d/` (deck or topic) and `/i/` (invite) on triviablack.com and www.triviablack.com. When the app is installed the phone opens it directly; otherwise the browser lands on the fallback page ("Open in app" plus attributed store buttons). Details, the link scheme and the owner checklist: `docs/DEEP-LINKS.md` in the platform repo.

- `.well-known/apple-app-site-association` (iOS universal links) and `.well-known/assetlinks.json` (Android app links). Both must be served **as JSON, with no redirect**, from both hosts. `.nojekyll` keeps GitHub Pages publishing `.well-known/`.
- `assetlinks.json` ships with a placeholder: paste the **Play App Signing** SHA-256 from Play Console → Test and release → App integrity → App signing.
- `g/index.html`, `u/index.html`, `d/index.html`, `i/index.html` and `404.html` are the same fallback page; `js/applink.js` reads the path (`/g/{id}`) or the query (`/g/?id={id}`) and fills in the copy. The query form works on any static host; the pretty form relies on the host serving `404.html` for unknown paths (GitHub Pages does, and Coolify's generated nginx config does with `error_page 404 /404.html`), and `index.html` redirects it to the query form on hosts that fall back to the home page instead.

Check after a deploy:

```
curl -sI https://triviablack.com/.well-known/apple-app-site-association   # 200, no Location header
curl -sI https://triviablack.com/.well-known/assetlinks.json              # 200, application/json
curl -s  https://triviablack.com/g/00000000000000000000000000000000 | grep -c applink.js   # 1
```
