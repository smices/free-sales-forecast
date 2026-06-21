const chromePort = process.env.CHROME_DEBUG_PORT || "9233";
const appUrlNeedle = process.env.APP_URL_NEEDLE || "127.0.0.1:5173";

const tabs = await fetch(`http://127.0.0.1:${chromePort}/json`).then((response) => response.json());
const tab = tabs.find((item) => item.url.includes(appUrlNeedle)) || tabs[0];
if (!tab?.webSocketDebuggerUrl) {
  throw new Error("No Chrome DevTools tab is available");
}

const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};

await new Promise((resolve) => {
  ws.onopen = resolve;
});

function send(method, params = {}) {
  return new Promise((resolve) => {
    const nextId = ++id;
    pending.set(nextId, resolve);
    ws.send(JSON.stringify({ id: nextId, method, params }));
  });
}

await send("Runtime.enable");

const expression = String.raw`
(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let i = 0; i < 50 && !document.querySelector("#loadSampleBtn"); i += 1) {
    await sleep(100);
  }
  document.querySelector("#loadSampleBtn").click();
  await sleep(200);
  const model = document.querySelector("#forecastModel");
  model.value = "featureMl";
  model.dispatchEvent(new Event("change", { bubbles: true }));
  document.querySelector("#runBtn").click();
  let status = "";
  for (let i = 0; i < 120; i += 1) {
    await sleep(250);
    status = document.querySelector("#statusText")?.textContent || "";
    if (
      status.includes("后端实验") ||
      status.includes("后端同步失败") ||
      status.includes("Backend experiment") ||
      status.includes("Backend sync failed")
    ) break;
  }
  return {
    title: document.title,
    status,
    audit: (document.querySelector("#processingAudit")?.innerText || "").slice(0, 1200),
    experiments: (document.querySelector("#experimentRows")?.innerText || "").slice(0, 500),
  };
})()
`;

const result = await send("Runtime.evaluate", {
  expression,
  awaitPromise: true,
  returnByValue: true,
});

ws.close();

if (result.result.exceptionDetails) {
  throw new Error(result.result.exceptionDetails.text || "Page evaluation failed");
}

const value = result.result.result.value;
console.log(JSON.stringify(value, null, 2));

if (!value.status.includes("后端实验") && !value.status.includes("Backend experiment")) {
  throw new Error(`Backend sync was not confirmed: ${value.status}`);
}
