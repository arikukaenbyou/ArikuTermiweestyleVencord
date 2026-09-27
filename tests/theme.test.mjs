// npm test  (node --test tests/theme.test.mjs)
// Offline: the committed theme matches the generator, the Vencord header is complete, the CSS is
// balanced. Online (skipped without network, or with OFFLINE=1): every Discord token the theme
// sets still exists in Discord's live CSS -- Discord renames tokens now and then, and a renamed
// token silently stops being themed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, cpSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const THEME = path.join(ROOT, 'AnvilTerminal.theme.css')
const css = readFileSync(THEME, 'utf8')
const ownTokens = () => [...new Set([...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]))].filter((t) => !t.startsWith('--anvil-'))

test('committed theme matches build.mjs', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'anvil-'))
  for (const f of ['build.mjs', 'package.json']) cpSync(path.join(ROOT, f), path.join(dir, f))
  execFileSync(process.execPath, [path.join(dir, 'build.mjs')], { stdio: 'pipe' })
  assert.equal(readFileSync(path.join(dir, 'AnvilTerminal.theme.css'), 'utf8'), css, 'stale theme -- run: node build.mjs')
})

test('Vencord/BetterDiscord meta header', () => {
  const head = css.slice(0, css.indexOf('*/'))
  assert.ok(css.startsWith('/**'))
  for (const key of ['@name', '@author', '@version', '@description', '@source']) assert.match(head, new RegExp(`\\* ${key} \\S`))
  const { version } = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  assert.match(head, new RegExp(`@version ${version.replaceAll('.', '\\.')}\\b`))
})

test('CSS is balanced and only imports what Vencord allows', () => {
  const body = css.replace(/\/\*[\s\S]*?\*\//g, '')
  assert.equal((body.match(/{/g) || []).length, (body.match(/}/g) || []).length)
  assert.equal((body.match(/\(/g) || []).length, (body.match(/\)/g) || []).length)
  for (const [, url] of body.matchAll(/@import url\('([^']+)'\)/g)) assert.match(url, /^https:\/\/fonts\.googleapis\.com\//)
  assert.ok(!/!important/.test(body), 'tokens only -- no !important')
})

test('the whole blurple ramp is recoloured', () => {
  for (let n = 1; n <= 99; n++) assert.match(css, new RegExp(`--blurple-${n}-hsl: 145 `))
})

async function discordTokens() {
  const get = async (url) => {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)' }, signal: AbortSignal.timeout(20000) })
    if (!r.ok) throw new Error(`${url}: ${r.status}`)
    return r.text()
  }
  const html = await get('https://discord.com/app')
  const sheets = [...new Set(html.match(/\/assets\/[\w.-]+\.css/g) || [])]
  const all = []
  for (let i = 0; i < sheets.length; i += 16) {
    all.push(...(await Promise.all(sheets.slice(i, i + 16).map((s) => get(`https://discord.com${s}`)))))
  }
  return new Set(all.join('\n').match(/--[a-z0-9-]+(?=\s*:)/g))
}

test('every token still exists in Discord (live)', { skip: process.env.OFFLINE === '1' && 'OFFLINE=1' }, async (t) => {
  let live
  try {
    live = await discordTokens()
  } catch (e) {
    t.skip(`no network: ${e.message}`)
    return
  }
  assert.ok(live.size > 1000, `only ${live.size} tokens found -- did Discord change how it ships CSS?`)
  const gone = ownTokens().filter((tok) => !live.has(tok))
  assert.deepEqual(gone, [], 'Discord no longer defines these tokens -- update build.mjs')
})
