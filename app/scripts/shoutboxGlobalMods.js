import scrollFix from './lib/shoutbox/scrollFix';
import colorMod from "./lib/shoutbox/colorMod";

(async function () {
  await Promise.all([scrollFix.init(), colorMod.init()]);
})().catch(console.error);
