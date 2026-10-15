# triviablack.com

Static site for [Trivia Black](https://apps.apple.com/us/app/trivia-black/id1476178356) by Swyft Studios LLC: landing page, support, privacy policy, terms and account deletion. Deployed to GitHub Pages by `.github/workflows/pages.yml`.

The store listings and the apps link to `privacy_policy.html`, `terms_and_conditions.html` and `account-deletion.html`, and `support.html` is the store Support URL, so keep those file names stable.

## Pages

- `index.html`: landing page (game, what's new, live events, deck sponsorship). Styles: `css/legal.css` (shared base) plus `css/site.css`.
- `houston/index.html`: Houston campaign page. QR codes point to `https://triviablack.com/houston/?r=<code>`. The script at the bottom keeps `r` (only `[a-z0-9-]`, max 24 characters) in sessionStorage and adds it to the store links (App Store `ct=houston26-<r>`, Play `referrer` with `utm_medium=<r>`). With no code it uses `direct`. Owner settings at the top of that script:
  - `LIVE_URL`: the live game link. While it is `null` the page shows "Live game opens Nov 2" instead of the play button.
  - `APPLE_PT`: the App Store Connect provider token (App Analytics > Campaigns). Left out of the link while `null`.
- `houston/rules.html`: Official Rules (placeholder until the final text is posted; remove its `noindex` tag then).

Preview locally: `C:/Python313/python.exe -m http.server 8765 --bind 127.0.0.1 --directory C:/tbwt/triviablack-site`, then open http://localhost:8765/.
