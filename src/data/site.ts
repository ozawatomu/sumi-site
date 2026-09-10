export const site = {
  name: 'Sumi',
  origin: 'https://sumicalculator.com',
  email: 'hello@sumicalculator.com',
  description:
    'A free scientific calculator for Android with textbook-style maths, exact fractions and surds, and a quiet ink-and-paper design. Offline. No ads. No tracking.',
  android: {
    available: true,
    url: 'https://play.google.com/store/apps/details?id=com.tomuozawa.sumi',
  },
  ios: { available: false },
} as const;

export function downloadUrl(campaign: string): string {
  const url = new URL(site.android.url);
  url.searchParams.set(
    'referrer',
    new URLSearchParams({
      utm_source: 'sumicalculator.com',
      utm_medium: 'website',
      utm_campaign: `website_${campaign}`,
    }).toString(),
  );
  return url.toString();
}
