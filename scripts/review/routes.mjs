// Route table shared by shots.mjs and audit.mjs: site path + the matching design-reference page.
export const ROUTES = {
  home: { path: '/', ref: { page: 'home' } },
  gallery: { path: '/gallery', ref: { page: 'gallery' } },
  photo: { path: '/gallery/p01', ref: { page: 'photo', arg: 0 } },
  journal: { path: '/blog', ref: { page: 'journal' } },
  'journal-empty': { path: '/blog', ref: { page: 'journal', empty: true }, siteNote: 'needs MOCK_EMPTY=posts' },
  post: { path: '/blog/long-title', ref: { page: 'post', arg: 1 } },
  'post-video': { path: '/blog/video-essay-1', ref: { page: 'post', arg: 0 } },
  about: { path: '/about', ref: { page: 'about' } },
  lab: { path: '/lab', ref: { page: 'lab' } },
  project: { path: '/lab/slab-100', ref: { page: 'project', arg: 0 } },
  nf: { path: '/this-page-does-not-exist', ref: { page: 'nf' } },
}
