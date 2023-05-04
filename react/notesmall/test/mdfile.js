const fs = require('fs');
const {marked} = require('marked');

// Read the Markdown file
const mdfile = fs.readFileSync('notesmall/react/notesmall/README.md', 'utf8');

// // Split the Markdown file into lines
// const mdLines = mdfile.split('\n');

// // Convert each line of Markdown to HTML
// let htmlContent = '';
// for (const mdLine of mdLines) {
//   htmlContent += marked(mdLine) + '\n';
// }
const htmlContent = marked(mdfile);

