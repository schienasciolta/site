# Monta a página de vendas a partir de _fonte/pagina.html: embute o desenhador da figura (do app) e as três figuras,
# põe o link do checkout e o pixel. Rodar de novo a cada mudança no modelo ou nos exercícios.
#   python _fonte/gerar.py
import json, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)
APP = os.path.join(os.path.dirname(SITE), 'app')

CHECKOUT = 'https://pay.cakto.com.br/j9i9xr6'  # checkout do front na Cakto
PIXEL_ID = ''           # dataset do Meta (preencher quando existir)
PAINEL = '<script async src="https://painel.labofertas.com/api/lp/script?k=f6a8ffdd8d97b8f1b6e4028b63ac8c50"></script>'  # visitas do painel (instalacao.script do diagnostico-rastreio)

ex = json.load(open(os.path.join(APP, '_fonte', 'conteudo', 'esercizi.json'), encoding='utf-8'))
figuras = {k: {x: ex[k][x] for x in ('A', 'B', 'v', 'p') if x in ex[k]} for k in ('gatto', 'respiro', 'ponte', 'sedia', 'camminata')}
figura_js = open(os.path.join(APP, '_fonte', 'figura.js'), encoding='utf-8').read()

pixel = ''
if PIXEL_ID:
    pixel = ("<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
             "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];"
             "s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');"
             f"fbq('init','{PIXEL_ID}');fbq('track','PageView');</script>"
             f'<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={PIXEL_ID}&ev=PageView&noscript=1"/></noscript>')
if PAINEL:  # o script de visitas vem depois do pixel, e entra mesmo antes de existir pixel
    pixel = (pixel + '\n' + PAINEL).strip()

s = open(os.path.join(AQUI, 'pagina.html'), encoding='utf-8').read()
s = (s.replace('__PIXEL__', pixel).replace('__CHECKOUT__', CHECKOUT)
      .replace('__FIGURA_JS__', figura_js).replace('__FIGURE__', json.dumps(figuras, separators=(',', ':'))))
assert not re.search(r'__[A-Z_]+__', s), 'sobrou marcador'
assert "fbq('track', 'Purchase')" not in s and "fbq('track','Purchase')" not in s, 'Purchase só pela CAPI do checkout'
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8', newline='\n').write(s)
open(os.path.join(SITE, '.nojekyll'), 'w').close()
print('ok: index.html', len(s.encode()) // 1024, 'KB', '| checkout:', CHECKOUT, '| pixel:', PIXEL_ID or 'falta')
