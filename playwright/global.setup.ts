import fs from 'fs/promises';
import path from 'path';

export default async function globalSetup() {
  const authDir = path.join(process.cwd(), 'playwright/.auth');

  await fs.rm(authDir, { recursive: true, force: true });
  await fs.mkdir(authDir, { recursive: true });
}
