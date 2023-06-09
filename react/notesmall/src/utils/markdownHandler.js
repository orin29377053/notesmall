import {marked} from "marked";

export default function markdownHandler(content) {
    if (!content) {
        return "";
    }
    const html = marked(content);
    const textWithoutMarkdown = html.replace(/<[^>]+>/g, "") 

    return textWithoutMarkdown.substring(0, 100)+'...(Read More)';
}
