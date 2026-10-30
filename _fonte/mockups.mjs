// Fotografa telas reais do app e põe cada uma num celular realista (aro de metal, borda preta, ilha dinâmica,
// barra de status, botões laterais, reflexo do vidro, sombra). Sai PNG em _fonte/png/; o mockups.py converte em WebP.
//   node _fonte/mockups.mjs http://127.0.0.1:8767/x9t6lb/
import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire('C:/dev/ofertas/.claude/skills/construcao/scripts/package.json');
const { chromium } = require('playwright');
const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(AQUI, 'png');
mkdirSync(SAIDA, { recursive: true });
const URL_APP = process.argv[2] || 'http://127.0.0.1:8767/x9t6lb/';

const hoje = new Date(); const iso = d => d.toISOString().slice(0, 10);
const base = { visto: true, medico: false, giorno: 4, fatto: null, pendente: false, libera: null, ultimo: null, completo: false, forte: 1, forteFatto: null };
// cada tela: o estado salvo do app, o que clicar depois de abrir e quanto rolar
const TELAS = {
  oggi: { estado: base, rolar: 0 },
  esercizio: { estado: base, clique: '[data-a="sessione"]', depois: ['[data-a="next"]', '[data-a="next"]', '[data-a="next"]'], espera: 300 },
  sera: { estado: { ...base, fatto: iso(hoje), pendente: true }, rolar: 0 },
  fasi: { estado: { ...base, giorno: 12 }, rolar: 0 },
  fermarsi: { estado: base, clique: '[data-a="allarme"]' },
  sveglia: { estado: base, clique: '[data-p="sveglia"]' },
  collo: { estado: base, clique: '[data-p="collo"]' },
  forte: { estado: { ...base, giorno: 21, completo: true }, clique: '[data-p="forte"]' },
};

const navegador = await chromium.launch({ headless: true, args: ['--mute-audio'] });
const ctx = await navegador.newContext({ viewport: { width: 390, height: 797 }, deviceScaleFactor: 2, locale: 'it-IT' });
const telas = {};
for (const [nome, t] of Object.entries(TELAS)) {
  const p = await ctx.newPage();
  await p.goto(URL_APP);
  await p.evaluate(e => { localStorage.setItem('ss_acesso', JSON.stringify(['base', 'sveglia', 'collo', 'forte'])); localStorage.setItem('ss_stato', JSON.stringify(e)); }, t.estado);
  await p.reload();
  await p.addStyleTag({ content: '.inst{display:none!important}' });
  if (t.clique) { await p.click(t.clique); }
  for (const c of t.depois || []) await p.click(c);
  await p.waitForTimeout(t.espera || 400);
  telas[nome] = (await p.screenshot({ type: 'png' })).toString('base64');
  await p.close();
}

const moldura = img => `<!doctype html><html><head><style>
*{box-sizing:border-box;margin:0}body{background:transparent;padding:40px 46px 70px}
.fone{position:relative;width:418px;height:872px;border-radius:66px;padding:12px;
 background:linear-gradient(145deg,#d9dde0 0%,#8e959b 18%,#eef1f3 36%,#7c838a 60%,#c9ced2 82%,#6f767c 100%);
 box-shadow:0 40px 70px -24px rgba(31,49,45,.45),0 18px 30px -18px rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,255,255,.55)}
.bot{position:absolute;width:5px;border-radius:3px;background:linear-gradient(90deg,#6f767c,#c9ced2)}
.b1{left:-4px;top:160px;height:32px}.b2{left:-4px;top:220px;height:62px}.b3{left:-4px;top:296px;height:62px}.b4{right:-4px;top:250px;height:96px}
.tela{position:relative;width:100%;height:100%;border-radius:55px;background:#000;padding:6px;overflow:hidden}
.vidro{position:relative;width:100%;height:100%;border-radius:49px;overflow:hidden;background:#f4eee6}
.status{height:47px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 38px;font:600 16px -apple-system,"Segoe UI",sans-serif;color:#1f312d}
.ilha{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:122px;height:35px;border-radius:20px;background:#000}
.ic{display:flex;gap:6px;align-items:center}
.app{display:block;width:100%}
.brilho{position:absolute;inset:0;border-radius:49px;background:linear-gradient(115deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 32%);pointer-events:none}
</style></head><body><div class="fone"><i class="bot b1"></i><i class="bot b2"></i><i class="bot b3"></i><i class="bot b4"></i>
<div class="tela"><div class="vidro"><div class="status"><span>9:41</span><span class="ic">
<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#1f312d"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#1f312d"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#1f312d"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#1f312d"/></svg>
<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5l2.4-3a3.4 3.4 0 0 0-4.8 0zM3.3 6.3a6.6 6.6 0 0 1 9.4 0l1.6-1.9a9.1 9.1 0 0 0-12.6 0zM.3 2.9a11 11 0 0 1 15.4 0" fill="#1f312d"/></svg>
<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#1f312d" opacity=".45"/><rect x="2" y="2" width="18" height="9" rx="2" fill="#1f312d"/><rect x="24.5" y="4.5" width="2" height="4" rx="1" fill="#1f312d" opacity=".45"/></svg>
</span></div><div class="ilha"></div><img class="app" src="data:image/png;base64,${img}"><div class="brilho"></div></div></div></div></body></html>`;

const pm = await ctx.newPage();
await pm.setViewportSize({ width: 510, height: 982 });
for (const [nome, img] of Object.entries(telas)) {
  await pm.setContent(moldura(img));
  await pm.waitForTimeout(150);
  writeFileSync(join(SAIDA, nome + '.png'), await pm.screenshot({ type: 'png', omitBackground: true }));
}
await navegador.close();
console.log('ok:', Object.keys(telas).join(', '), '->', SAIDA);
