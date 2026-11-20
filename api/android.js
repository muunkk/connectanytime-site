// Redirects to the newest Android APK. The Android repo only publishes pre-releases,
// so GitHub's /releases/latest/download/ shortcut doesn't work for it.
const REPO = 'muunkk/connectanytime-android';
const FALLBACK = `https://github.com/${REPO}/releases`;
// Only ever redirect to this repo's own release downloads.
const ALLOWED_PREFIX = `https://github.com/${REPO}/releases/download/`;

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, {
      headers: { accept: 'application/vnd.github+json', 'user-agent': 'connectanytime-site' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    for (const release of await res.json()) {
      if (release.draft) continue;
      const apk = release.assets.find(
        (a) => a.name.endsWith('.apk') && a.browser_download_url?.startsWith(ALLOWED_PREFIX),
      );
      if (apk) {
        return new Response(null, {
          status: 302,
          headers: {
            location: apk.browser_download_url,
            'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
          },
        });
      }
    }
  } catch (err) {
    console.error('android download lookup failed:', err);
  }
  return new Response(null, { status: 302, headers: { location: FALLBACK, 'cache-control': 'no-store' } });
}
