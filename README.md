# connectanytime-site

Landing page for ConnectAnytime, one-tap Connect for the NYU Shanghai VPN on
[Mac](https://github.com/muunkk/connectanytime),
[iPhone](https://github.com/muunkk/connectanytime-ios) and
[Android](https://github.com/muunkk/connectanytime-android).

Live at https://boonchan.com/connectanytime. boonchan.com (repo `muunkk/boonchancom`) proxies
`/connectanytime/*` to this Vercel project, so pushes to `main` here deploy it. The site lives
under `/connectanytime/` in this project too, and `/` redirects there.

- `public/connectanytime/` is the static site (one HTML page, one small script, icons). Keep
  every asset path prefixed with `/connectanytime/` so it resolves on boonchan.com.
- `api/android.js` redirects `/connectanytime/download/android` to the newest APK. Android releases are
  all pre-releases, which GitHub's `/releases/latest/download/` shortcut skips.
- The Mac button uses `/releases/latest/download/ConnectAnytime.dmg` directly.
- `vercel.json` sets the rewrite and security headers (strict CSP: no inline scripts).

Not affiliated with Cisco or NYU.
