// npm test — the Markdown subset (lib/content/markdown.ts), including what Keystatic's editor writes.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseInline, parseMarkdown } from '../lib/content/markdown.ts'

const refs = []
const resolve = async (ref, caption) => {
  refs.push(ref)
  return { image: null, w: 4, h: 5, ratio: '4:5', caption }
}

test('escaped placeholders read the same as unescaped ones', async () => {
  const plain = await parseMarkdown('[Body text placeholder.]', resolve)
  const escaped = await parseMarkdown('\\[Body text placeholder.\\]', resolve)
  assert.deepEqual(escaped, plain)
  assert.deepEqual(plain, [{ type: 'p', children: [{ t: 'text', v: '[Body text placeholder.]' }] }])
})

test('a photo ref the editor kept as escaped text is still a figure', async () => {
  refs.length = 0
  const blocks = await parseMarkdown('!\\[\\[Panorama caption\\]\\](photo:p04)', resolve)
  assert.equal(blocks[0].type, 'figures')
  assert.equal(blocks[0].items[0].caption, '[Panorama caption]')
  assert.deepEqual(refs, ['photo:p04'])
})

test('two images on one line make a pair', async () => {
  refs.length = 0
  const blocks = await parseMarkdown('![[Caption]](photo:p07) ![\\[Caption\\]](/content/posts/x/a.jpg)', resolve)
  assert.equal(blocks[0].type, 'figures')
  assert.equal(blocks[0].items.length, 2)
  assert.deepEqual(refs, ['photo:p07', '/content/posts/x/a.jpg'])
})

test('escaped headings keep their text and id', async () => {
  const [h] = await parseMarkdown('## \\[Chapter title\\]', resolve)
  assert.deepEqual(h, { type: 'h2', text: '[Chapter title]', id: 'chapter-title' })
})

test('escaped emphasis markers are text; real emphasis and links still parse', () => {
  assert.deepEqual(parseInline('a \\*not em\\* b'), [{ t: 'text', v: 'a *not em* b' }])
  assert.deepEqual(parseInline('x _em_ **strong** [link](https://a.b) `code`'), [
    { t: 'text', v: 'x ' },
    { t: 'em', v: 'em' },
    { t: 'text', v: ' ' },
    { t: 'strong', v: 'strong' },
    { t: 'text', v: ' ' },
    { t: 'link', v: 'link', href: 'https://a.b' },
    { t: 'text', v: ' ' },
    { t: 'code', v: 'code' },
  ])
})

test('a quote with an escaped bracket', async () => {
  const [q] = await parseMarkdown('> \\[A line worth pulling out.\\]', resolve)
  assert.deepEqual(q, { type: 'quote', children: [{ t: 'text', v: '[A line worth pulling out.]' }] })
})
