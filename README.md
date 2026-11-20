# connectanytime-site

Landing page for ConnectAnytime, one-tap Connect for the NYU Shanghai VPN on
[Mac](https://github.com/muunkk/connectanytime),
[iPhone](https://github.com/muunkk/connectanytime-ios) and
[Android](https://github.com/muunkk/connectanytime-android).

Live at https://connectanytime.vercel.app. Pushes to `main` deploy through Vercel.

- `public/` is the static site (one HTML page, one small script, icons).
- `api/android.js` redirects `/download/android` to the newest APK. Android releases are
  all pre-releases, which GitHub's `/releases/latest/download/` shortcut skips.
- The Mac button uses `/releases/latest/download/ConnectAnytime.dmg` directly.
- `vercel.json` sets the rewrite and security headers (strict CSP: no inline scripts).

Not affiliated with Cisco or NYU.
