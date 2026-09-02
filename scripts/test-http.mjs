import { spawn } from "node:child_process";
import { once } from "node:events";
const base = "http://127.0.0.1:4320";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "4320"], { stdio: ["ignore", "pipe", "pipe"] });
let started = false;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Servidor de teste não iniciou")), 15000);
    server.stdout.on("data", chunk => {
      if (!started && chunk.toString().includes("Ready")) { started = true; clearTimeout(timeout); resolve(); }
    });
    server.stderr.on("data", chunk => process.stderr.write(chunk));
    server.once("exit", code => { if (!started) { clearTimeout(timeout); reject(new Error(`Servidor encerrou: ${code}`)); } });
  });
  const tests = spawn(process.execPath, ["--test", "tests/release.test.mjs"], { stdio: "inherit", env: { ...process.env, TEST_BASE_URL: base } });
  const [code] = await once(tests, "exit");
  process.exitCode = code || 0;
} finally {
  server.kill("SIGTERM");
}
