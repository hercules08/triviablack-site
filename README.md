# triviablack.com

Static site for [Trivia Black](https://apps.apple.com/us/app/trivia-black/id1476178356) by Swyft Studios LLC: landing page, support, privacy policy, terms and account deletion. Deployed to GitHub Pages by `.github/workflows/pages.yml`.

The store listings and the apps link to `privacy_policy.html`, `terms_and_conditions.html` and `account-deletion.html`, and `support.html` is the store Support URL, so keep those file names stable.

## Pages

- `index.html`: landing page (game, what's new, live events, deck sponsorship). Styles: `css/legal.css` (shared base) plus `css/site.css`.

Preview locally: `C:/Python313/python.exe -m http.server 8765 --bind 127.0.0.1 --directory C:/tbwt/triviablack-site`, then open http://localhost:8765/.
