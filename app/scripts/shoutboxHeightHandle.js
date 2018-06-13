import shoutboxHeightHandle from './lib/shoutbox/heightHandle';

(async function () {
  await shoutboxHeightHandle.init();
})().catch(console.error);
