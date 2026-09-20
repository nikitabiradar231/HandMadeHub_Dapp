// Copies the compiler-generated ZK assets (zkir + keys) from
// `contracts/managed/handmade-marketplace` into `frontend/public/zkConfig`,
// where the browser's FetchZkConfigProvider serves them.
//
// FetchZkConfigProvider expects this exact layout:
//   /zkConfig/zkir/<circuitId>.bzkir
//   /zkConfig/keys/<circuitId>.prover
//   /zkConfig/keys/<circuitId>.verifier
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(scriptsDir, '..');
const rootDir = path.resolve(frontendDir, '..');

const source = path.join(rootDir, 'contracts', 'managed', 'handmade-marketplace');
const targetConfig = path.join(frontendDir, 'public', 'zkConfig');
const targetSrcManaged = path.join(frontendDir, 'src', 'managed', 'handmade-marketplace');

if (fs.existsSync(path.join(source, 'zkir'))) {
  fs.rmSync(targetConfig, { recursive: true, force: true });
  fs.cpSync(path.join(source, 'zkir'), path.join(targetConfig, 'zkir'), { recursive: true });
  fs.cpSync(path.join(source, 'keys'), path.join(targetConfig, 'keys'), { recursive: true });

  fs.rmSync(targetSrcManaged, { recursive: true, force: true });
  fs.cpSync(path.join(source, 'contract'), path.join(targetSrcManaged, 'contract'), { recursive: true });
  console.log(`[copy-zk] Copied ZK assets & contract module -> frontend`);
} else if (fs.existsSync(path.join(targetConfig, 'zkir'))) {
  console.log(`[copy-zk] ZK assets already present at ${targetConfig}`);
} else {
  console.warn(`[copy-zk] Notice: source ${source} not found, ensuring ${targetConfig} directory exists.`);
  fs.mkdirSync(path.join(targetConfig, 'zkir'), { recursive: true });
  fs.mkdirSync(path.join(targetConfig, 'keys'), { recursive: true });
}
