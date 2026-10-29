"""Download original assets referenced by Figma design-context responses."""
import concurrent.futures
import json
import pathlib
import re
import subprocess

root = pathlib.Path(__file__).resolve().parent.parent
destination = root / 'public' / 'assets'
destination.mkdir(parents=True, exist_ok=True)
assets = {}
manifest = {}
for source in sorted((root / '.design-reference').glob('screen-*.txt')):
    content = source.read_text()
    prefix = re.search(r'const assetPathPrefix = "([^"]+)"', content)
    if not prefix:
        continue
    entries = re.findall(r'const (\w+) = `\$\{assetPathPrefix\}/([\w.-]+\.(?:png|svg|jpg|jpeg|webp))`', content)
    manifest[source.stem.removeprefix('screen-')] = {
        name: '/assets/' + filename for name, filename in entries
    }
    for _, filename in entries:
        assets.setdefault(filename, prefix[1] + '/' + filename)
assets.update({
    '43048.svg': 'https://www.figma.com/api/mcp/asset/d758ef47-4fb4-4ed5-a47c-8ea9f0cd90a4/43048.svg',
    'fdb56.svg': 'https://www.figma.com/api/mcp/asset/3122290e-a527-4fb2-b7c2-2bc70f8732e3/fdb56.svg',
    '34fb9.svg': 'https://www.figma.com/api/mcp/asset/246eb9db-590b-457a-a870-39cc97692f1e/34fb9.svg',
})

def download(entry):
    filename, url = entry
    target = destination / filename
    if target.exists() and target.stat().st_size:
        return
    subprocess.run(['curl', '-L', '--fail', '--silent', '--show-error', '--max-time', '30',
                    '--output', str(target), url], check=True)

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(download, assets.items()))
(root / '.design-reference' / 'assets.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Downloaded {len(assets)} unique original assets; wrote per-screen asset manifest.')
