import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const viteCli = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const serverOutDir = new URL('../.ssr-build', import.meta.url);

try {
  execFileSync(process.execPath, [viteCli.pathname, 'build'], { stdio: 'inherit' });
  execFileSync(process.execPath, [viteCli.pathname, 'build', '--ssr', 'src/entry-server.jsx', '--outDir', serverOutDir.pathname], { stdio: 'inherit' });

  const { prerenderSite } = await import(pathToFileURL(new URL('./prerender-site.js', import.meta.url).pathname));
  await prerenderSite({ serverOutDir: serverOutDir.pathname });
  const { validateBuiltSite } = await import(pathToFileURL(new URL('./validate-built-site.js', import.meta.url).pathname));
  const result = await validateBuiltSite(new URL('../dist', import.meta.url).pathname);
  console.log(`Build verified: ${result.entryCount} published entries across ${result.routeCount} prerendered routes.`);
} finally {
  rmSync(serverOutDir, { recursive: true, force: true });
}
