import parseFrontmatter from "front-matter";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

export default (mdText) => {
  const { data: meta, content } = parseFrontmatter(mdText);
  const bodyHtml = marked.parse(content);

  return (data) => {
    const merged = Object.assign(Object.create(meta), data);
    merged.content = unsafeHTML(bodyHtml);
    return merged;
  };
};
