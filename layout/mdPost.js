import parseFrontmatter from "gray-matter";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { layout } from "../js/engine.js";

// レンダラーのカスタマイズ
const renderer = {
  heading({ depth, text }) {
    return `<h${depth} id="${text}">${text}</h${depth}>`;
  },
  link({ href, text }) {
    const path = href.startsWith("/") ? `${globalThis.BASE}${href}` : href;
    return `<a href="${path}">${text}</a>`;
  },
  image({ href, text }) {
    return `<img src="${globalThis.BASE}${href}" alt=${text} />`;
  },
};

marked.use({ renderer });
export default (mdText) => {
  const defaults = {
    layout: "post",
  };
  const { data, content } = parseFrontmatter(mdText);
  const merged = Object.assign(Object.create(defaults), data);
  merged.content = marked.parse(content);
  return layout(merged, (page) => unsafeHTML(page.content));
};
