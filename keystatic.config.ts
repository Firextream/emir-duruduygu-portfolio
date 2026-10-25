// Keystatic: the editor at /keystatic for the files in content/ and public/content/.
// This schema is also what lib/content/files reads with, so the editor and the site never disagree.
//
//   content/photos/<address>.yaml        content/posts/<address>.md (frontmatter + text)
//   content/mood/<address>.yaml          content/projects/<address>.md (frontmatter + about)
//   content/about.yaml  content/milestones.yaml  content/settings.yaml
//
// Images are stored per entry: public/content/<collection>/<address>/<file>.
// Placeholder copy is written in [brackets] (npm run placeholders lists every one).
import { collection, config, fields, singleton } from '@keystatic/core'
import { KEYSTATIC_REPO, KEYSTATIC_STORAGE } from './lib/keystatic-mode'
import { SKINS, skinDef } from './lib/skins'

const images = (folder: string) => ({ directory: `public/content/${folder}`, publicPath: `/content/${folder}/` })

/** The Markdown the skins can lay out: paragraphs, ## / ### headings, quotes, links, images. */
const text = (label: string, folder?: string, description?: string) =>
  fields.mdx({
    label,
    description,
    extension: 'md',
    options: {
      bold: true,
      italic: true,
      strikethrough: false,
      code: true,
      heading: [2, 3],
      blockquote: true,
      orderedList: false,
      unorderedList: false,
      table: false,
      link: true,
      divider: false,
      codeBlock: false,
      image: folder ? images(folder) : false,
    },
  })

const order = fields.integer({
  label: 'Order',
  description: 'Optional. Lower numbers come first; entries without one follow, newest first.',
})

const placeholderRatio = (description = 'Only while there is no image: the striped placeholder’s proportions, e.g. 4:5.') =>
  fields.text({ label: 'Placeholder ratio', description })

const address = (label: string, path: string) =>
  fields.slug({
    name: { label, validation: { isRequired: true } },
    slug: { label: 'Address', description: `${path}<address>. Links break if it changes after publishing.` },
  })

export default config({
  storage: KEYSTATIC_STORAGE === 'github' ? { kind: 'github', repo: KEYSTATIC_REPO } : { kind: 'local' },
  ui: {
    brand: { name: 'duruduygu.com' },
    navigation: {
      Content: ['photos', 'posts', 'projects', 'mood'],
      Pages: ['about', 'milestones', 'settings'],
    },
  },
  collections: {
    photos: collection({
      label: 'Photos',
      path: 'content/photos/*',
      slugField: 'title',
      format: 'yaml',
      columns: ['title', 'place', 'date'],
      schema: {
        title: address('Title', '/gallery/'),
        image: fields.image({
          label: 'Image',
          description: 'Shown at its own ratio — never cropped or filtered. Up to 2560 px on the long edge (npm run images).',
          ...images('photos'),
        }),
        alt: fields.text({ label: 'Alt text', description: 'What the photo shows, for screen readers. The title is used if empty.' }),
        place: fields.text({ label: 'Place' }),
        date: fields.date({ label: 'Date', description: 'Shown as MM.YYYY. Empty shows the [MM.YYYY] placeholder.' }),
        camera: fields.text({ label: 'Camera' }),
        medium: fields.select({
          label: 'Film or digital',
          options: [
            { label: 'Not set', value: 'unset' },
            { label: 'Digital', value: 'digital' },
            { label: 'Film', value: 'film' },
          ],
          defaultValue: 'unset',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value }),
        note: fields.text({ label: 'Note', multiline: true, description: 'Optional short note in the photo viewer.' }),
        order,
        placeholder_ratio: placeholderRatio(),
        file: fields.text({
          label: 'File name',
          description: 'Quiet shows a file name in its captions, e.g. IMG_3849.jpg. Keystatic saves every upload as image.<ext>, so put the original name here; empty shows <address>.<ext>.',
        }),
      },
    }),

    mood: collection({
      label: 'Moodboard',
      path: 'content/mood/*',
      slugField: 'title',
      format: 'yaml',
      columns: ['title', 'source'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } }, slug: { label: 'File name' } }),
        image: fields.image({ label: 'Image', description: 'Shown at its own ratio.', ...images('mood') }),
        source: fields.text({ label: 'Source', description: 'Credit or URL.' }),
        order,
        placeholder_ratio: placeholderRatio(),
      },
    }),

    posts: collection({
      label: 'Journal',
      path: 'content/posts/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: address('Title', '/blog/'),
        kind: fields.conditional(
          fields.select({
            label: 'Kind',
            options: [
              { label: 'Essay', value: 'essay' },
              { label: 'Note', value: 'note' },
              { label: 'Video', value: 'video' },
            ],
            defaultValue: 'essay',
          }),
          {
            essay: fields.empty(),
            note: fields.empty(),
            video: fields.object(
              {
                host: fields.select({
                  label: 'Host',
                  options: [
                    { label: 'YouTube', value: 'YouTube' },
                    { label: 'Vimeo', value: 'Vimeo' },
                    { label: 'File', value: 'File' },
                  ],
                  defaultValue: 'YouTube',
                }),
                url: fields.text({
                  label: 'Video URL',
                  description: 'Watch URL (YouTube / Vimeo) or a direct file URL. While empty the player shows the poster only.',
                }),
                duration: fields.text({ label: 'Duration', description: 'mm:ss' }),
                poster: fields.image({ label: 'Poster (16:9)', ...images('posts') }),
                chapters: fields.array(
                  fields.object({
                    time: fields.text({ label: 'Time', description: 'mm:ss — the chapter list seeks the player.' }),
                    title: fields.text({ label: 'Title', description: 'Match a ## heading in the text (the transcript).' }),
                  }),
                  { label: 'Chapters', itemLabel: (props) => `${props.fields.time.value} — ${props.fields.title.value}` },
                ),
              },
              { label: 'Video' },
            ),
          },
        ),
        date: fields.date({ label: 'Date', description: 'The journal groups posts by its year. Empty shows the [DD.MM.YYYY] placeholder.' }),
        year: fields.text({ label: 'Year group (placeholder only)', description: 'Only used while Date is empty, e.g. [2026].' }),
        order: fields.integer({ label: 'Order', description: 'Optional. Orders posts with the same date (or none); lower comes first.' }),
        excerpt: fields.text({ label: 'Excerpt', description: 'One line for lists.' }),
        place: fields.text({ label: 'Place' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value }),
        read_time: fields.text({ label: 'Reading time', description: 'e.g. “6 min”. Counted from the text if empty. Video posts show ▶ duration.' }),
        standfirst: fields.text({ label: 'Standfirst', multiline: true, description: 'The large opening lines.' }),
        margin_note: fields.text({ label: 'Margin note', multiline: true, description: 'Beside the text in Modernist and Quiet. Optional.' }),
        cover: fields.relationship({
          label: 'Cover photo',
          collection: 'photos',
          description: 'Fig. 01 above an essay or note — a gallery photo (keeps its catalogue number). Not used for videos.',
        }),
        cover_image: fields.image({ label: 'Cover image', description: 'Instead of a gallery photo.', ...images('posts') }),
        cover_caption: fields.text({ label: 'Cover caption', description: 'The title is used if empty.' }),
        body: text(
          'Text',
          'posts',
          'Paragraphs, ## / ### headings (one per chapter in a video post), quotes, links and images. Two images in one paragraph make a pair. A gallery photo: ![Caption](photo:<address>) on its own line.',
        ),
      },
    }),

    projects: collection({
      label: 'Lab projects',
      path: 'content/projects/*',
      slugField: 'name',
      format: { contentField: 'about' },
      entryLayout: 'content',
      columns: ['name', 'kind'],
      schema: {
        name: address('Name', '/lab/'),
        order: fields.integer({ label: 'Order', description: 'Position on the Lab page; lower comes first.' }),
        kind: fields.text({ label: 'Kind', description: 'e.g. Hardware, Clothes.' }),
        one_liner: fields.text({ label: 'One-liner' }),
        status: fields.text({ label: 'Status', description: 'e.g. Prototype 2.' }),
        year: fields.text({ label: 'Year' }),
        tools: fields.text({ label: 'Tools' }),
        image: fields.image({ label: 'Image', description: 'Shown contained — never cropped.', ...images('projects') }),
        image_caption: fields.text({ label: 'Image caption' }),
        drawing: fields.image({ label: 'Drawing', description: 'Image or SVG, shown on white in a box.', ...images('projects') }),
        drawing_caption: fields.text({ label: 'Drawing caption' }),
        placeholder_ratio: placeholderRatio('Only while there is no image, e.g. 4:5.'),
        stages: fields.array(
          fields.object({
            label: fields.text({ label: 'Step' }),
            state: fields.select({
              label: 'State',
              options: [
                { label: 'Done', value: 'done' },
                { label: 'Now', value: 'now' },
                { label: 'Next', value: 'next' },
              ],
              defaultValue: 'next',
            }),
          }),
          {
            label: 'Stages',
            description: 'The build steps (Modernist “01 Status”, Quiet status.log). One should be Now.',
            itemLabel: (props) => `${props.fields.label.value} — ${props.fields.state.value}`,
          },
        ),
        photos: fields.array(
          fields.object({
            image: fields.image({ label: 'Image', ...images('projects') }),
            placeholder_ratio: placeholderRatio('Only while there is no image, e.g. 3:2.'),
            caption: fields.text({ label: 'Caption' }),
          }),
          { label: 'More photos', description: 'Prototype, details.', itemLabel: (props) => props.fields.caption.value || 'Photo' },
        ),
        log: fields.array(
          fields.object({
            date: fields.date({ label: 'Date', description: 'Empty shows the [YYYY.MM.DD] placeholder.' }),
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'What changed and why', multiline: true }),
          }),
          {
            label: 'Design log',
            description: 'Shown newest first.',
            itemLabel: (props) => `${props.fields.date.value ?? '[date]'} — ${props.fields.title.value}`,
          },
        ),
        about: text('About the project', 'projects', 'What it is, why it exists, what is left.'),
      },
    }),
  },

  singletons: {
    about: singleton({
      label: 'About',
      path: 'content/about',
      format: 'yaml',
      schema: {
        portrait: fields.image({
          label: 'Portrait',
          description: 'Shown at its own ratio (Modernist, Quiet, Original); Soft Club’s jewel case crops it square.',
          ...images('about'),
        }),
        summary: fields.text({ label: 'Summary', multiline: true, description: 'A short paragraph about your studies and what’s next (Soft Club).' }),
        body: fields.mdx.inline({
          label: 'Text',
          description: 'The long text (Modernist, Quiet, Original).',
          options: { strikethrough: false, heading: [2, 3], orderedList: false, unorderedList: false, table: false, divider: false, codeBlock: false, image: false },
        }),
        currently: fields.text({ label: 'Currently', description: 'What you’re working on now.' }),
        location: fields.text({ label: 'Location', defaultValue: 'Istanbul, TR' }),
        study: fields.text({ label: 'Study' }),
        shooting: fields.text({ label: 'Shooting', description: 'Soft Club “now”.' }),
        listening: fields.text({ label: 'Listening', description: 'Soft Club “now”.' }),
      },
    }),

    milestones: singleton({
      label: 'Milestones',
      path: 'content/milestones',
      format: 'yaml',
      schema: {
        items: fields.array(
          fields.object({
            year: fields.text({ label: 'Year' }),
            title: fields.text({ label: 'Title', description: 'Short name of the step (Modernist shows it alone).' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'Milestones', description: 'Newest first.', itemLabel: (props) => `${props.fields.year.value} — ${props.fields.title.value}` },
        ),
      },
    }),

    settings: singleton({
      label: 'Site settings',
      path: 'content/settings',
      format: 'yaml',
      schema: {
        ...Object.fromEntries(
          SKINS.map((k) => [
            `home_photo_${k}`,
            fields.relationship({
              label: `Home photo — ${skinDef(k).label}`,
              collection: 'photos',
              description: 'Empty uses the first photo with an image.',
            }),
          ]),
        ),
        email: fields.text({ label: 'Email', defaultValue: 'emir@duruduygu.com' }),
      },
    }),
  },
})
