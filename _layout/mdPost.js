import parseFrontmatter from "front-matter";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

export default (mdText) => {
  const defaults = {
    layout: "post",
  };
  const { data: meta, content } = parseFrontmatter(mdText);
  const bodyHtml = marked.parse(content);

  return (data) => {
    let merged = Object.assign(Object.create(defaults), meta);
    console.log(
      meta.title,
      meta.layout,
      "+",
      data.title,
      data.layout,
      "=>",
      merged.title,
      merged.layout,
    );
    merged = Object.assign(merged, data);
    merged.content = unsafeHTML(bodyHtml);
    merged.layout = defaults.layout;
    return merged;
  };
};
