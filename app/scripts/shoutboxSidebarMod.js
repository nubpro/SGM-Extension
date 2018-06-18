import shoutboxSidebarMod from './lib/shoutbox/sidebarMod';

(async function () {
  await shoutboxSidebarMod.init();
})().catch(console.error);
