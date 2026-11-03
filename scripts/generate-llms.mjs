#!/usr/bin/env node
// Gera o llms.txt da raiz a partir da navegação pt-BR do docs.json e do frontmatter de cada página.
// Uso: node scripts/generate-llms.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://developer.z-api.io';

const docs = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8'));
const languages = docs.navigation.languages;
const ptBr = languages.find((l) => l.language === 'pt-BR');

function frontmatter(page) {
  const file = join(ROOT, `${page}.mdx`);
  if (!existsSync(file)) throw new Error(`Página não encontrada: ${page}.mdx`);
  const match = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  for (const line of (match ? match[1] : '').split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  return data;
}

function pageLine(page) {
  const path = page.replace(/^\//, '');
  const { title = path, description, api } = frontmatter(path);
  let line = `- [${title}](${BASE_URL}/${path}.md)`;
  const details = [description, api && `\`${api}\``].filter(Boolean).join(' ');
  if (details) line += `: ${details}`;
  return line;
}

// Páginas soltas viram itens; subgrupos viram um heading um nível abaixo.
function renderGroup(group, level, out) {
  out.push(`${'#'.repeat(level)} ${group.group}`, '');
  const loose = group.pages.filter((p) => typeof p === 'string');
  if (loose.length) out.push(...loose.map(pageLine), '');
  for (const sub of group.pages.filter((p) => typeof p !== 'string')) renderGroup(sub, level + 1, out);
}

function countPages(lang) {
  const walk = (pages) => pages.reduce((n, p) => n + (typeof p === 'string' ? 1 : walk(p.pages)), 0);
  return lang.tabs.reduce((n, t) => n + t.groups.reduce((m, g) => m + walk(g.pages), 0), 0);
}

const out = [
  '# Z-API Docs',
  '',
  '> Documentação oficial da Z-API, API REST para integrar aplicações ao aplicativo de mensagens: envio e recebimento de mensagens, grupos, comunidades, contatos, status, webhooks e gestão de instâncias.',
  '',
  'Servidor: `https://api.z-api.io`. As rotas de instância seguem `/instances/{{instanceId}}/token/{{token}}/<rota>` e todas as chamadas enviam o header `Client-Token: {{clientToken}}`. O método e o caminho de cada endpoint aparecem ao lado da descrição. Cada página abaixo está disponível em Markdown (sufixo `.md`).',
  '',
];

for (const tab of ptBr.tabs) {
  // A aba "API Reference" tem um grupo "API Reference" que só agrupa as seções; ele é achatado.
  out.push(`## ${tab.tab}`, '');
  for (const group of tab.groups) {
    if (group.group === tab.tab && group.pages.every((p) => typeof p !== 'string')) {
      for (const sub of group.pages) renderGroup(sub, 3, out);
    } else {
      renderGroup(group, 3, out);
    }
  }
}

const anchors = docs.navigation.global?.anchors ?? [];
if (anchors.length) {
  out.push('## Optional', '', ...anchors.map((a) => `- [${a.anchor}](${a.href})`), '');
}

const indexes = languages
  .filter((l) => l !== ptBr)
  .map((l) => {
    const slug = l.language.toLowerCase();
    const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(l.language);
    return `- [${name} (${countPages(l)} pages)](${BASE_URL}/_llms/${slug}.txt): Documentation for ${name}.`;
  });
if (indexes.length) {
  out.push(
    '> The links below point to documentation indexes. Follow each `/_llms/` index recursively until you reach documentation pages.',
    '',
    '## Indexes',
    '',
    ...indexes,
    '',
  );
}

writeFileSync(join(ROOT, 'llms.txt'), out.join('\n'));
console.log(`llms.txt gerado com ${out.filter((l) => l.startsWith('- [')).length} links.`);
