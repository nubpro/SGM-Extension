import background from './lib/background';

(async function () {
  await background.init();
})().catch(console.error);
