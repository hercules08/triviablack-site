# triviablack.com

Static site for [Trivia Black](https://apps.apple.com/us/app/trivia-black/id1476178356) by Swyft Studios LLC: landing page, support, privacy policy, terms and account deletion. Deployed to GitHub Pages by `.github/workflows/pages.yml`.

The store listings and the apps link to `privacy_policy.html`, `terms_and_conditions.html` and `account-deletion.html`, and `support.html` is the store Support URL, so keep those file names stable.

## Pages

- `index.html`: landing page (game, what's new, live events, deck sponsorship). Styles: `css/legal.css` (shared base) plus `css/site.css`.
- `legends/`: "Black Tech Legends" campaign page (paid search). Store links carry `ct=legends-<src>` / `utm_campaign=legends-<src>` from `?src=`; `?city=houston` swaps the hero copy. Owner setting in the page script: `WEB_GAME_URL` (null hides "Play in your browser"). GA4 events: `click_app_store`, `click_play_store`, `start_web_game` with `{page, src, city}`.
- `partners/`: sponsorship / ERG events page with the lead form. It posts JSON to `LEAD_ENDPOINT` (`https://api.triviablack.com/api/v1/leads`, triviablack-platform) and falls back to a prefilled mailto; GA4 `generate_lead` with `{interest, timing}` only.
- Campaign styles: `css/campaign.css`, loaded after `legal.css` and `site.css`.

Preview locally: `C:/Python313/python.exe -m http.server 8765 --bind 127.0.0.1 --directory C:/tbwt/triviablack-site`, then open http://localhost:8765/.
