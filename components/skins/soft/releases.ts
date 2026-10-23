// Soft Club catalogue for projects: the n-th project is release DD-0(3+n). The obi copy was written
// for the reference's three projects, so it follows the project (by slug), not its position.
import type { Release, ReleaseInfo } from './JewelCase'

const WRITTEN: Record<string, Release> = { 'slab-100': 'dd03', charm: 'dd04', denim: 'dd05' }

export const catNo = (i: number) => `DD-${String(3 + i).padStart(2, '0')}`
export const isClothes = (p: { kind: string }) => p.kind.toLowerCase() === 'clothes'
export const kindJp = (p: { kind: string }) => (isClothes(p) ? '服' : '機械')

export function projectRelease(p: { slug: string; kind: string; name: string }, i: number): { release: Release; info: Partial<ReleaseInfo> } {
  const known = WRITTEN[p.slug]
  if (known) return { release: known, info: { no: catNo(i) } }
  const cloth = isClothes(p)
  return {
    release: cloth ? 'dd05' : 'dd03',
    info: {
      no: catNo(i),
      jp: kindJp(p),
      obi: cloth ? '仕立ての服' : '手作りの機械',
      count: '01',
      unit: cloth ? 'pattern' : 'prototype',
      ring: `${p.kind.toUpperCase()} · ${p.name.toUpperCase()}`,
    },
  }
}

