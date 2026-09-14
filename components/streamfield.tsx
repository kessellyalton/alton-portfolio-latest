import Image from "next/image";

import { imageUrl, type WagtailImage } from "../lib/api";

type Block = {
  type: string;
  value: unknown;
  id: string;
};

type CodeValue = { language: string; code: string };

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function StreamField({ blocks }: { blocks: Block[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const text = block.value as string;
      return (
        <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight text-ink-100">
          {text}
        </h2>
      );
    }

    case "paragraph": {
      const html = block.value as string;
      return (
        <div
          className="max-w-none text-ink-300 [&_a]:text-electric-300 [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gold-400/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink-100 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink-100 [&_li]:my-1 [&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:my-4 [&_p]:leading-relaxed [&_strong]:text-ink-100 [&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    case "image": {
      const image = block.value as WagtailImage;
      const url = imageUrl(image);
      if (!url) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40">
          <div className="relative aspect-[16/9]">
            <Image
              src={url}
              alt={image.title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {image.title && (
            <figcaption className="border-t border-navy-800 px-4 py-3 text-center text-xs text-ink-500">
              {image.title}
            </figcaption>
          )}
        </figure>
      );
    }

    case "code": {
      const { language, code } = block.value as CodeValue;
      return (
        <div className="my-6 overflow-hidden rounded-xl border border-navy-800 bg-navy-950">
          {language && (
            <div className="border-b border-navy-800 bg-navy-900/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gold-300">
              {language}
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-sm">
            <code className="font-mono text-ink-200">{code}</code>
          </pre>
        </div>
      );
    }

    case "quote": {
      const text = block.value as string;
      return (
        <blockquote className="my-8 border-l-4 border-gold-400/60 bg-navy-900/40 py-4 pl-6 pr-4 italic text-ink-200">
          {text}
        </blockquote>
      );
    }

    default:
      return null;
  }
}
