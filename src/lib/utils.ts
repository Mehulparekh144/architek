import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { marked } from 'marked';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function convertMarkdownToHtml(markdown: string) {
  try {
    marked.setOptions({
      breaks: true
    });

    const html = marked.parse(markdown);
    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '';
  }
}