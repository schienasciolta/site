# Capas dos produtos na Cakto (1200x1000): o celular com a tela do produto no quadrado do meio,
# porque o checkout mostra a capa pequena e recortada em quadrado.
#   python _fonte/capas.py   (depois do mockups.mjs, que deixa os PNG em _fonte/png/)
import os
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(AQUI)
CAPAS = {'front': 'esercizio', 'sveglia': 'sveglia', 'collo': 'collo', 'forte': 'forte'}
os.makedirs(os.path.join(SITE, 'img', 'capa'), exist_ok=True)
for nome, tela in CAPAS.items():
    fundo = Image.new('RGB', (1200, 1000), (226, 238, 232))
    fone = Image.open(os.path.join(AQUI, 'png', tela + '.png')).convert('RGBA')
    alto = 960; larg = round(fone.width * alto / fone.height)
    fone = fone.resize((larg, alto), Image.LANCZOS)
    fundo.paste(fone, ((1200 - larg) // 2, 30), fone)
    destino = os.path.join(SITE, 'img', 'capa', nome + '.jpg')
    fundo.save(destino, 'JPEG', quality=86, optimize=True)
    print(nome, os.path.getsize(destino) // 1024, 'KB')
