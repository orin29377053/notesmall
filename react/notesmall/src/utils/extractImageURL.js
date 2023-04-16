export default function extractImageURL(content) {
    const regex = /(https?:\/\/[^\s]*?\.(?:png|jpg|jpeg|gif))/gi;
    const matches = content.match(regex);
    return matches ? matches[0] : null;
}