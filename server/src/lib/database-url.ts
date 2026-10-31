import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Raiz do pacote server (funciona tanto em src/lib quanto em dist/lib).
const serverRoot = fileURLToPath(new URL('../../', import.meta.url));

/** Converte `file:./x.db` em caminho absoluto a partir de `server/`, para CLI e app usarem o mesmo arquivo. */
export function resolveDatabaseUrl(url: string) {
  if (!url.startsWith('file:')) return url;
  const file = url.slice('file:'.length);
  return path.isAbsolute(file) ? url : `file:${path.resolve(serverRoot, file)}`;
}

export const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL ?? 'file:./dev.db');
