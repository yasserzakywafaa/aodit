/**
 * Fixes prerender HTML where a service-worker reload nests a second
 * document (</head><body><div id="root">…) inside the first #root.
 */

const ROOT_MARKER = '<div id="root"';

function countRoots(html) {
  let count = 0;
  let pos = 0;
  while ((pos = html.indexOf(ROOT_MARKER, pos)) !== -1) {
    count += 1;
    pos += ROOT_MARKER.length;
  }
  return count;
}

function extractRootInnerHtml(html, rootStart) {
  const openEnd = html.indexOf(">", rootStart);
  if (openEnd === -1) return null;

  let depth = 1;
  let i = openEnd + 1;

  while (i < html.length) {
    const nextDiv = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return null;

    if (nextDiv !== -1 && nextDiv < nextClose) {
      const charAfter = html[nextDiv + 4];
      if (charAfter === " " || charAfter === ">") {
        depth += 1;
      }
      i = nextDiv + 4;
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      return html.slice(openEnd + 1, nextClose);
    }
    i = nextClose + 6;
  }

  return null;
}

function collectTailAssets(html, fromIndex) {
  const tail = html.slice(fromIndex);
  const links = tail.match(/<link[^>]+>/gi) ?? [];
  const scripts = tail.match(/<script[\s\S]*?<\/script>/gi) ?? [];
  return [...links, ...scripts].join("\n");
}

/**
 * @param {string} html
 * @returns {string}
 */
function sanitizePrerenderedHtml(html) {
  if (countRoots(html) <= 1) {
    const firstRoot = html.indexOf(ROOT_MARKER);
    if (firstRoot === -1) return html;
    const nestedHead = html.indexOf("</head>", firstRoot);
    if (nestedHead === -1) return html;
  }

  const firstRoot = html.indexOf(ROOT_MARKER);
  if (firstRoot === -1) return html;

  let lastRoot = firstRoot;
  let pos = firstRoot;
  while ((pos = html.indexOf(ROOT_MARKER, pos + 1)) !== -1) {
    lastRoot = pos;
  }

  const headEnd = html.indexOf("</head>");
  if (headEnd === -1) return html;
  const head = html.slice(0, headEnd + 7);

  const rootInner = extractRootInnerHtml(html, lastRoot);
  if (!rootInner) return html;

  const rootClose = html.indexOf("</div>", lastRoot);
  const tailAssets =
    rootClose === -1 ? "" : collectTailAssets(html, rootClose + 6);

  const bodyMatch = html.match(/<body([^>]*)>/i);
  const bodyAttrs = bodyMatch ? bodyMatch[1] : "";

  const noscriptMatch = html.match(/<noscript>[\s\S]*?<\/noscript>/i);
  const noscript = noscriptMatch ? noscriptMatch[0] : "";

  return `${head}
<body${bodyAttrs}>
${noscript}
<div id="root">${rootInner}</div>
${tailAssets}
</body>
</html>`;
}

module.exports = { sanitizePrerenderedHtml, countRoots };
