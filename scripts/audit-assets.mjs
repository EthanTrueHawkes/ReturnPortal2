import fs from 'node:fs'
import path from 'node:path'
const sourceFiles=fs.readdirSync('src',{recursive:true}).filter(f=>/\.(tsx?|css)$/.test(f))
const names=new Set(sourceFiles.flatMap(f=>fs.readFileSync(path.join('src',f),'utf8').match(/\b[a-f0-9]{5}\.(?:png|svg)\b/g)||[]))
for(const name of names){const file=path.join('public/assets',name);if(!fs.existsSync(file)||!fs.statSync(file).size)throw new Error(`Missing or empty asset: ${name}`)}
for(const file of sourceFiles){if(fs.readFileSync(path.join('src',file),'utf8').includes('figma.com/api/mcp/asset'))throw new Error(`Temporary runtime asset URL in ${file}`)}
const originals=fs.readdirSync('public/assets')
for(const name of originals)if(!fs.statSync(path.join('public/assets',name)).size)throw new Error(`Empty original: ${name}`)
console.log(`${names.size} referenced original assets verified; ${originals.length} downloaded originals are nonempty. No temporary runtime URLs.`)
