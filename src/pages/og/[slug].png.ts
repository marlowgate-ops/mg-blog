import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;

// Fonts copied from /public/fonts -> /dist/fonts at build time.
// NOTE: Compiled endpoint lives in dist/pages/og/ => dist/fonts is "../../fonts/..."
const PUBLIC_FONT_CANDIDATES = [
  '../../fonts/NotoSansJP-Bold.ttf',
  '../../fonts/NotoSansJP-VariableFont_wght.ttf',
];

// Fallback: same directory as this file (dev convenience)
const LOCAL_SAME_DIR = [
  './NotoSansJP-Bold.ttf',
  './NotoSansJP-VariableFont_wght.ttf',
];

async function tryRead(rel: string): Promise<ArrayBuffer | null> {
  try {
    const url = new URL(rel, import.meta.url);
    const buf = await readFile(url);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    return null;
  }
}

async function loadFont(): Promise<ArrayBuffer> {
  for (const rel of PUBLIC_FONT_CANDIDATES) {
    const ab = await tryRead(rel);
    if (ab) return ab;
  }
  for (const rel of LOCAL_SAME_DIR) {
    const ab = await tryRead(rel);
    if (ab) return ab;
  }
  throw new Error('OG: font not found. Put NotoSansJP-Bold.ttf in public/fonts/ (recommended) or next to this file.');
}

function truncate(str: string, max = 88) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function card(title: string, description?: string) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH + 'px',
        height: HEIGHT + 'px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff',
        color: '#0f172a',
        padding: '56px',
        boxSizing: 'border-box',
        fontFamily: 'NotoSansJP',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: '#334155' },
            children: [
              { type: 'div', props: { style: { width: '14px', height: '14px', background: '#111', borderRadius: '4px' } } },
              { type: 'div', props: { children: 'Marlow Gate — Blog' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '18px' },
            children: [
              { type: 'div', props: { style: { fontSize: '56px', fontWeight: 700, lineHeight: 1.15 }, children: title } },
              description
                ? { type: 'div', props: { style: { fontSize: '28px', color: '#475569' }, children: description } }
                : null,
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '22px', color: '#475569' },
            children: [
              { type: 'div', props: { children: 'blog.marlowgate.com' } },
              { type: 'div', props: { style: { background: '#111', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '20px' }, children: 'Trading data & automation' } },
            ],
          },
        },
      ],
    },
  } as any;
}

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug as string;
  const posts = await getCollection('blog');
  const post = posts.find((p) => p.slug === slug);
  const title = truncate(post?.data.title ?? 'Marlow Gate');
  const description = truncate(post?.data.description ?? '');

  const fontData = await loadFont();

  const svg = await satori(card(title, description), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'NotoSansJP', data: fontData, weight: 700, style: 'normal' }],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH }, background: 'white' });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
