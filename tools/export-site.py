from pathlib import Path
import base64
import json
import re

root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
html = (dist / 'index.html').read_text()
css = (dist / 'styles.css').read_text()
js = (dist / 'app.js').read_text()
catalog = json.loads((dist / 'catalog.json').read_text())

for image in dist.glob('*.png'):
    css_ref = "url('" + image.name + "')"
    html_ref = 'src="' + image.name + '"'
    if css_ref in css or html_ref in html:
        uri = 'data:image/png;base64,' + base64.b64encode(image.read_bytes()).decode()
        css = css.replace(css_ref, "url('" + uri + "')")
        html = html.replace(html_ref, 'src="' + uri + '"')

loader = "const r=await fetch('catalog.json');if(!r.ok)throw Error();const data=await r.json();"
assert loader in js, 'Catalog loader changed; update the standalone exporter.'
js = js.replace(loader, "const data=JSON.parse(document.getElementById('embedded-catalog').textContent);")
links = re.search(r'<link rel="stylesheet" href="styles\.css[^"]*"><script src="app\.js[^"]*" defer></script>', html)
assert links, 'Stylesheet or script tags changed; update the standalone exporter.'
html = html.replace(links.group(0), '<style>' + css + '</style>')
embedded = json.dumps(catalog, ensure_ascii=False).replace('<', '\\u003c')
html = html.replace('</body>', '<script id="embedded-catalog" type="application/json">' + embedded + '</script><script>' + js + '</script></body>')
(root / 'Elonverse.html').write_text(html)
print('Regenerated Elonverse.html.')
