export default function sanitizeContent(content) {
    if (!content) {
        return "";
    }
    const urlPattern = /(https?:\/\/[^\s]+)/g; // 匹配網址的正則表達式

    const text = content
        .replace(urlPattern, "")
        .replace(/(#######)/g, "") // 刪除所有的井號（##）
        .replace(/(\*\*\*)/g, "") // 刪除所有的星號（**）
        .replace(/[#*!()\[\]<>]-/g, "") // 刪除所有的符號
        .replace(/(#+)/g, ""); // 刪除所有的井號（#）
    return text.substring(0, 100);
}
