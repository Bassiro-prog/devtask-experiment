import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const TEST_DB_FILE = 'test.db';

export default function setup() {
  rmSync(TEST_DB_FILE, { force: true });
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: `file:./${TEST_DB_FILE}` },
    stdio: 'ignore',
  });
}
