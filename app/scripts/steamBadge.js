import steamBadge from './lib/steam/badge.js';

(async function () {
  await steamBadge.init();
})().catch(console.error);
