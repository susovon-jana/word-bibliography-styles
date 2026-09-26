import { readdir, writeFile } from 'node:fs/promises';
const base='https://susovon-jana.github.io/word-bibliography-styles/';
const styles=(await readdir('./styles')).filter(f=>f.toLowerCase().endsWith('.xsl')).sort();
const urls=['index.html', ...styles.map(f=>`styles/${f}`)];
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${base}${u}</loc></url>`).join('\n')+'\n</urlset>\n';
await writeFile('sitemap.xml',xml);
console.log(`SEO sitemap generated for ${styles.length} styles.`);
