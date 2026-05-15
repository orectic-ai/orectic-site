// Smoke test: serve the built dist/ and assert the SPA actually mounts content.
// Catches silent runtime failures where the bundle 200s but throws on mount
// (e.g. the react / react-dom version mismatch that took the site down for
// 4 days in May 2026). Designed to be run after `npm run build`, both
// locally and in CI.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const NAV_TIMEOUT_MS = 30_000;
const MOUNT_TIMEOUT_MS = 15_000;
const SERVER_BIND_TIMEOUT_MS = 20_000;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.once("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const probe = async () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`server never responded at ${url} within ${timeoutMs}ms`));
        return;
      }
      try {
        const res = await fetch(url, { redirect: "manual" });
        if (res.ok || res.status === 304) {
          resolve();
          return;
        }
      } catch {
        // not up yet
      }
      setTimeout(probe, 250);
    };
    probe();
  });
}

const port = await findFreePort();
const url = `http://localhost:${port}/`;

const server = spawn(
  "./node_modules/.bin/vite",
  ["preview", "--port", String(port), "--strictPort"],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let serverStderr = "";
server.stderr.on("data", (chunk) => {
  serverStderr += chunk.toString();
});

// Hard failures (block merge):
//   1. `pageerror` — an uncaught JS exception bubbled to the window. This is
//      what the original React #527 mismatch produced, and it is the canonical
//      signal that the SPA itself is broken.
//   2. `waitForFunction` timeout — `#root` never got any children mounted.
//
// `console.error` is treated as a soft warning and logged but does not fail.
// Reason: real-world pages emit console.error for plenty of non-fatal things
// (resource 404s, NotSameOrigin / CORS messages, deprecation notices from
// third-party CDNs). Failing on those would make this gate too brittle to
// trust, and they have nothing to do with whether the React tree mounted.
const hardErrors = [];
const softWarnings = [];

try {
  await waitForServer(url, SERVER_BIND_TIMEOUT_MS);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (err) => hardErrors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      softWarnings.push(`console.error: ${msg.text()}`);
    }
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      return root && root.children.length > 0;
    },
    null,
    { timeout: MOUNT_TIMEOUT_MS },
  );

  const childCount = await page.evaluate(() => document.getElementById("root").children.length);
  await browser.close();

  if (hardErrors.length) {
    console.error(`\nFAIL: ${hardErrors.length} runtime error(s) during mount:`);
    for (const e of hardErrors) console.error("  " + e);
    process.exit(1);
  }

  if (softWarnings.length) {
    console.warn(`WARN: ${softWarnings.length} soft warning(s) (not blocking):`);
    for (const w of softWarnings) console.warn("  " + w);
  }

  console.log(`PASS: #root mounted with ${childCount} child element(s), no runtime errors.`);
  process.exit(0);
} catch (err) {
  console.error(`\nFAIL: smoke test threw: ${err.message}`);
  if (serverStderr.trim()) {
    console.error("vite preview stderr:");
    console.error(serverStderr);
  }
  if (hardErrors.length) {
    console.error("Captured runtime errors before failure:");
    for (const e of hardErrors) console.error("  " + e);
  }
  process.exit(1);
} finally {
  server.kill("SIGTERM");
}
