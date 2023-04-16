export default function sanitizeContent(content) {
    const text = content
        .replace(/[#*!()\[\]<>]-/g, "") // 刪除所有的符號
        .replace(/(#+)/g, ""); // 刪除所有的井號（#）
    return text.substring(0, 100) ;
}