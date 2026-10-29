// Format with the project's existing TypeScript compiler; no extra dependency.
import ts from 'typescript'
import fs from 'node:fs'
import path from 'node:path'
const files=fs.readdirSync('src',{recursive:true}).filter(f=>/\.(tsx?|css)$/.test(f)).map(f=>path.join('src',f))
for(const file of files){
 let text=fs.readFileSync(file,'utf8')
 if(file.endsWith('.css')){
  let depth=0
  text=text.replace(/\s+/g,' ').replace(/\s*([{};])\s*/g,(_,symbol)=>{
   if(symbol==='{'){depth++;return ' {\n'+'  '.repeat(depth)}
   if(symbol==='}'){depth=Math.max(0,depth-1);return '\n'+'  '.repeat(depth)+'}\n'+'  '.repeat(depth)}
   return ';\n'+'  '.repeat(depth)
  }).replace(/^ +$/gm,'').replace(/\*\/\s*/g,'*/\n').replace(/\n\s*\n/g,'\n').trim()+'\n'
 }else{
  text=text.replace(/></g,'>\n<')
  const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS)
  text=ts.createPrinter({newLine:ts.NewLineKind.LineFeed}).printFile(source)
 }
 fs.writeFileSync(file,text)
}
console.log(`Formatted ${files.length} source files.`)
