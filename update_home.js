const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// 1. PropertyCard -> React.memo
content = content.replace(
  'const PropertyCard = ({ property, index }) => {',
  'const PropertyCard = React.memo(({ property, index }) => {'
);
content = content.replace(
  '// ─── Skeleton ────────────────────────────────────────────────────────────────',
  '});\n\n// ─── Skeleton ────────────────────────────────────────────────────────────────'
);
// Fix the closing bracket of PropertyCard -> replaced below via script since standard replace doesn't work well across that many lines.

