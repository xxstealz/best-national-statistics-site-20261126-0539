// National Stats Atlas — hand-in program (Node 22, standard library only).
// Copies the static site (app/) and its screenshots (screenshots/) from beside
// this file into /output, then writes /output/dossier.json — the summary the
// judge reads — with the vendored make.fun library. The library file
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer rebuilds
// the dossier with its own copy and compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyTree(source, target) {
  if (!existsSync(source)) return;
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, "app"), join(outDir, "app"));
copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));

// The scorer's caps: text_max_bytes shapes the dossier text; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files and directories in app/ or 16 MiB of app files).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(`National Stats Atlas handed in to ${outDir} (${dossier.length} bytes of dossier)`);
