// Banner do topo do checkout (1600x900, exibido inteiro): título, selos e o app num celular realista.
// Texto da copy aprovada. Sai em img/banner-checkout.jpg.
//   node _fonte/banner.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire('C:/dev/ofertas/.claude/skills/construcao/scripts/package.json');
const { chromium } = require('playwright');
const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const fone = readFileSync(join(SITE, 'img', 'app-esercizio.webp')).toString('base64');
const icone = readFileSync(join(SITE, 'img', 'apple-touch-180.png')).toString('base64');

const html = `<!doctype html><html><head><style>
*{box-sizing:border-box;margin:0}
body{width:1600px;height:900px;background:linear-gradient(120deg,#f4eee6 0%,#e2eee8 100%);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f312d;overflow:hidden}
.c{display:grid;grid-template-columns:1fr 440px;align-items:center;height:100%;padding:0 90px 0 110px}
.marca{display:flex;align-items:center;gap:18px;font-weight:700;font-size:36px}
.marca img{width:64px;height:64px;border-radius:16px}
h1{font-size:92px;line-height:1.02;letter-spacing:-.02em;margin-top:36px}
p{font-size:38px;color:#5d6d68;margin-top:24px}
.selos{display:flex;flex-wrap:wrap;gap:16px;margin-top:44px}
.selo{display:flex;align-items:center;gap:12px;background:#fffdf9;border:2px solid #cfe3da;border-radius:999px;padding:16px 28px;font-size:30px;font-weight:700;color:#2f6f62}
.selo svg{width:30px;height:30px}
.f img{width:440px;display:block}
</style></head><body><div class="c"><div>
<div class="marca"><img src="data:image/png;base64,${icone}">Schiena Sciolta</div>
<h1>Il piano di 3 settimane per la schiena</h1>
<p>10-12 minuti al giorno, a casa, sul telefono.</p>
<div class="selos">
<span class="selo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Pagamento unico</span>
<span class="selo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Si apre dal telefono</span>
<span class="selo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>15 giorni per il rimborso</span>
</div></div>
<div class="f"><img src="data:image/webp;base64,${fone}"></div></div></body></html>`;

const b = await chromium.launch({ headless: true, args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.setContent(html);
await p.waitForTimeout(300);
await p.screenshot({ path: join(SITE, 'img', 'banner-checkout.jpg'), type: 'jpeg', quality: 86 });
await b.close();
console.log('ok: img/banner-checkout.jpg');
