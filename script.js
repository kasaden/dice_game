/* ---------- Utilities ---------- */
const $ = (s, d = document) => d.querySelector(s);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const to2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
const to4 = (x) => (Math.round(x * 10000) / 10000).toFixed(4);
const money = (x) =>
  (Math.round(x * 100) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
// Accept "1.5" and "1,5" alike
const num = (v) => parseFloat(String(v).replace(",", ".")) || 0;
const signed = (x) => (x >= 0 ? "+" : "−") + money(Math.abs(x));

// Never rewrite the field the visitor is typing in; it is reformatted on blur
function setVal(sel, v) {
  const el = $(sel);
  if (document.activeElement !== el) el.value = v;
}

const MIN_CHANCE = 0.01;
const MAX_CHANCE = 98;
const HISTORY_LIMIT = 200;

let state = {
  over: false, // false = under
  chance: 50.0, // %
  edgePct: 0.1, // %
  multiplier: 1.998,
  roll: 50.0,
  lastRoll: null,
  wins: 0,
  losses: 0,
  totalBets: 0,
  pl: 0,
  serverSeed: "",
  clientSeed: "",
  nonce: 0,
  cursor: 0, // increments each roll

  // Wallet system
  walletBalance: 1000.0,
  highestBalance: 1000.0,
  lowestBalance: 1000.0,
  currentWinStreak: 0,
  currentLossStreak: 0,
  maxWinStreak: 0,
  maxLossStreak: 0,
};

/* ---------- Status messages (replace alert()) ---------- */
const statusTimers = {};
function setStatus(id, msg, tone = "") {
  const el = $("#" + id);
  el.textContent = msg;
  if (tone) el.dataset.tone = tone;
  else delete el.dataset.tone;
  clearTimeout(statusTimers[id]);
  if (msg && tone !== "error") {
    statusTimers[id] = setTimeout(() => setStatus(id, ""), 4000);
  }
}

/* ---------- Sync visuals ---------- */
function updateBar() {
  const range = $("#roll-range");
  range.value = state.roll;
  range.setAttribute(
    "aria-valuetext",
    `Roll ${state.over ? "over" : "under"} ${to2(state.roll)}, ${to2(state.chance)} % chance`
  );
  $("#bar").style.setProperty("--split", to2(state.roll) + "%");
  $("#track").classList.toggle("is-over", state.over);
  $("#over-under-label").textContent = state.over ? "over" : "under";

  const bet = num($("#bet").value);
  const profit = bet * (state.multiplier - 1);
  $("#profit").value = to2(profit);

  if ($("#result").dataset.state === "idle") {
    // Idle: the big numeral shows the target until the first roll
    $("#stat-last").textContent = to2(state.roll);
    $("#result-detail").textContent = `Roll ${state.over ? "over" : "under"} ${to2(state.roll)} to win ${money(profit)} USDC`;
  }
}

function syncFromChance() {
  state.chance = clamp(state.chance, MIN_CHANCE, MAX_CHANCE);
  const p = state.chance / 100;
  const edge = clamp(state.edgePct, 0, 10) / 100;
  state.multiplier = (1 - edge) / p;
  state.roll = state.over ? 100 - p * 100 : p * 100;
  setVal("#chance", to2(state.chance));
  setVal("#multiplier", to4(state.multiplier));
  setVal("#roll", to2(state.roll));
  updateBar();
}

function syncFromMultiplier() {
  const edge = clamp(state.edgePct, 0, 10) / 100;
  const p = (1 - edge) / clamp(state.multiplier, 1.0001, 1e9);
  state.chance = clamp(p * 100, MIN_CHANCE, MAX_CHANCE);
  state.roll = state.over ? 100 - state.chance : state.chance;
  setVal("#chance", to2(state.chance));
  setVal("#multiplier", to4(state.multiplier));
  setVal("#roll", to2(state.roll));
  updateBar();
}

function syncFromRoll() {
  // Keep the win chance inside its allowed range
  state.roll = state.over
    ? clamp(state.roll, 100 - MAX_CHANCE, 100 - MIN_CHANCE)
    : clamp(state.roll, MIN_CHANCE, MAX_CHANCE);
  const p = state.over ? (100 - state.roll) / 100 : state.roll / 100;
  state.chance = p * 100;
  const edge = clamp(state.edgePct, 0, 10) / 100;
  state.multiplier = (1 - edge) / p;
  setVal("#chance", to2(state.chance));
  setVal("#multiplier", to4(state.multiplier));
  setVal("#roll", to2(state.roll));
  updateBar();
}

function syncFromEdge() {
  const edge = clamp(state.edgePct, 0, 10) / 100;
  const p = clamp(state.chance, MIN_CHANCE, MAX_CHANCE) / 100;
  state.multiplier = (1 - edge) / p;
  setVal("#multiplier", to4(state.multiplier));
  updateBar();
}

/* ---------- Wallet functions ---------- */
function setSigned(el, value) {
  el.textContent = signed(value);
  el.dataset.sign = value > 0 ? "pos" : value < 0 ? "neg" : "";
}

function updateWalletDisplay() {
  $("#wallet-balance").textContent = money(state.walletBalance);
  $("#stat-highest").textContent = money(state.highestBalance);
  $("#stat-lowest").textContent = money(state.lowestBalance);
  $("#stat-max-wins").textContent = state.maxWinStreak;
  $("#stat-max-losses").textContent = state.maxLossStreak;
}

function updateWalletBalance(amount) {
  state.walletBalance += amount;

  // Update highest/lowest balance
  if (state.walletBalance > state.highestBalance) {
    state.highestBalance = state.walletBalance;
  }
  if (state.walletBalance < state.lowestBalance) {
    state.lowestBalance = state.walletBalance;
  }

  updateWalletDisplay();
}

function deposit() {
  const amount = num($("#deposit-amount").value);
  if (!(amount > 0)) {
    setStatus("cashier-status", "Enter an amount above 0 to deposit.", "error");
    return;
  }

  updateWalletBalance(amount);
  setStatus("cashier-status", `Deposited ${money(amount)} USDC.`, "ok");
  logNote(`Deposit +${money(amount)} USDC`);
}

function withdraw() {
  const amount = num($("#deposit-amount").value);
  if (!(amount > 0)) {
    setStatus("cashier-status", "Enter an amount above 0 to withdraw.", "error");
    return;
  }

  if (amount > state.walletBalance) {
    setStatus(
      "cashier-status",
      `You can withdraw up to ${money(state.walletBalance)} USDC.`,
      "error"
    );
    return;
  }

  updateWalletBalance(-amount);
  setStatus("cashier-status", `Withdrew ${money(amount)} USDC.`, "ok");
  logNote(`Withdrawal −${money(amount)} USDC`);
}

function updateWinLossStreaks(isWin) {
  if (isWin) {
    state.currentWinStreak++;
    state.currentLossStreak = 0;
    if (state.currentWinStreak > state.maxWinStreak) {
      state.maxWinStreak = state.currentWinStreak;
    }
  } else {
    state.currentLossStreak++;
    state.currentWinStreak = 0;
    if (state.currentLossStreak > state.maxLossStreak) {
      state.maxLossStreak = state.currentLossStreak;
    }
  }
  updateWalletDisplay();
}

/* ---------- Rail (native range input) ---------- */
$("#roll-range").addEventListener("input", (e) => {
  state.roll = +(+e.target.value).toFixed(2);
  syncFromRoll();
});

/* ---------- Inputs ---------- */
$("#chance").addEventListener("input", (e) => {
  state.chance = num(e.target.value);
  syncFromChance();
});
$("#multiplier").addEventListener("input", (e) => {
  state.multiplier = num(e.target.value);
  syncFromMultiplier();
});
$("#roll").addEventListener("input", (e) => {
  state.roll = num(e.target.value);
  syncFromRoll();
});
$("#edge").addEventListener("input", (e) => {
  state.edgePct = num(e.target.value);
  syncFromEdge();
});
// Reformat the synced fields once the visitor leaves them
["chance", "multiplier", "roll"].forEach((id) =>
  $("#" + id).addEventListener("blur", () => setTimeout(syncFromChance))
);

$("#bet").addEventListener("input", () => {
  setStatus("table-status", "");
  updateBar();
});

document.querySelectorAll('input[name="direction"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    state.over = radio.value === "over";
    syncFromChance(); // keep the same probability
  });
});

/* ---------- Provably fair: HMAC-SHA256 ---------- */
async function hmacSHA256(keyHex, msg) {
  const enc = new TextEncoder();
  let rawKey;
  if (/^[0-9a-f]+$/i.test(keyHex)) {
    const bytes = new Uint8Array(keyHex.length / 2);
    for (let i = 0; i < bytes.length; i++)
      bytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
    rawKey = bytes;
  } else {
    rawKey = enc.encode(keyHex);
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hmacToRoll(h) {
  const hex = h.slice(0, 13); // 52 bits
  const val = parseInt(hex, 16);
  const frac = val / Math.pow(2, 52);
  const roll = Math.floor(frac * 10000) / 100; // 2 decimals
  return roll; // [0,100)
}

function rndMath() {
  return Math.floor(Math.random() * 10000) / 100;
}

async function getRoll() {
  const msg = `${state.clientSeed || "client"}:${state.nonce}:${state.cursor}`;
  let roll;
  try {
    const h = await hmacSHA256(state.serverSeed || "server", msg);
    roll = hmacToRoll(h);
  } catch (e) {
    roll = rndMath();
  }
  state.lastRoll = roll;
  state.cursor++;
  return roll;
}

function generateNewSeeds() {
  const rnd = crypto.getRandomValues(new Uint8Array(16));
  const srv = [...rnd].map((b) => b.toString(16).padStart(2, "0")).join("");
  $("#server-seed").value = srv;
  $("#client-seed").value = "client-" + Math.random().toString(36).slice(2, 7);
  state.serverSeed = srv;
  state.clientSeed = $("#client-seed").value;
  state.nonce = 0;
  state.cursor = 0;
  $("#nonce").value = 0;
  $("#seed-hash").textContent = "Press “Hash server seed” to publish it.";
}

$("#btn-new-seeds").addEventListener("click", () => {
  generateNewSeeds();
  logNote("New seeds drawn");
});

$("#btn-hash").addEventListener("click", async () => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode($("#server-seed").value || "server")
  );
  const hex = [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  $("#seed-hash").textContent = hex;
  logNote(`Server seed hash ${hex}`);
});

["server-seed", "client-seed", "nonce"].forEach((id) => {
  $("#" + id).addEventListener("input", (e) => {
    if (id === "nonce") state.nonce = Math.max(0, Math.floor(num(e.target.value)));
    else state[id.replace("-s", "S")] = e.target.value;
  });
});

/* ---------- History ---------- */
function trimHistory() {
  const body = $("#history-body");
  while (body.rows.length > HISTORY_LIMIT) body.deleteRow(-1);
  $("#history-empty").hidden = body.rows.length > 0;
}

function addRow(cells, cls) {
  const body = $("#history-body");
  const tr = body.insertRow(0);
  if (cls) tr.className = cls;
  cells.forEach(([text, tdClass, colSpan]) => {
    const td = tr.insertCell();
    if (tdClass) td.className = tdClass;
    if (colSpan) td.colSpan = colSpan;
    if (text instanceof Node) td.appendChild(text);
    else td.textContent = text;
  });
  trimHistory();
}

function logNote(msg) {
  addRow([[msg, "note", 4]], "is-note");
}

function logBet(n, target, roll, win, profit) {
  const outcome = document.createElement("span");
  outcome.className = "outcome";
  outcome.textContent = win ? "Win" : "Loss";
  const profitCell = document.createDocumentFragment();
  profitCell.append(outcome, signed(profit));
  addRow(
    [
      ["#" + n],
      [target],
      [to2(roll)],
      [profitCell, "profit"],
    ],
    win ? "is-win" : "is-loss"
  );
}

/* ---------- Result display and the dolly ---------- */
function showResult(roll, win, profit, fast) {
  const result = $("#result");
  result.dataset.state = win ? "win" : "loss";
  $("#stat-last").textContent = to2(roll);
  $("#result-verdict").textContent = win
    ? `Win · ${signed(profit)} USDC`
    : `Loss · ${signed(profit)} USDC`;
  $("#result-detail").textContent = `Rolled ${to2(roll)}, needed ${state.over ? "over" : "under"} ${to2(state.roll)}`;

  if (!fast) {
    result.classList.remove("is-fresh");
    void result.offsetWidth; // restart the settle animation
    result.classList.add("is-fresh");
  }

  const dolly = $("#dolly");
  dolly.hidden = false;
  dolly.classList.toggle("is-win", win);
  dolly.classList.toggle("is-loss", !win);
  dolly.style.setProperty("--dolly-pos", (roll / 100).toFixed(4));
  $("#dolly-tag").textContent = to2(roll);
}

function resetResult() {
  const result = $("#result");
  result.dataset.state = "idle";
  result.classList.remove("is-fresh");
  $("#result-verdict").textContent = "Place your bet";
  $("#dolly").hidden = true;
  updateBar();
}

/* ---------- Rolling logic ---------- */
function isWin(roll) {
  return state.over ? roll > state.roll : roll < state.roll;
}

async function playOnce(betAmt, fast = false) {
  if (!(betAmt > 0)) {
    setStatus("table-status", "Enter a bet above 0 to roll.", "error");
    return null;
  }
  // Check the player can cover the bet
  if (betAmt > state.walletBalance) {
    setStatus(
      "table-status",
      `Not enough balance for a ${money(betAmt)} USDC bet. Lower the bet or deposit in the Cashier tab.`,
      "error"
    );
    return null;
  }
  setStatus("table-status", "");

  const roll = await getRoll();
  const win = isWin(roll);
  const profit = win ? betAmt * (state.multiplier - 1) : -betAmt;

  updateWalletBalance(profit);
  updateWinLossStreaks(win);

  state.pl += profit;
  state.totalBets++;
  if (win) state.wins++;
  else state.losses++;
  $("#stat-winloss").textContent = `${state.wins} / ${state.losses}`;
  $("#stat-total").textContent = state.totalBets;
  setSigned($("#stat-balance"), state.pl);

  showResult(roll, win, profit, fast);
  logBet(
    state.totalBets,
    `${state.over ? ">" : "<"} ${to2(state.roll)}`,
    roll,
    win,
    profit
  );
  return { win, profit };
}

$("#btn-roll").addEventListener("click", async () => {
  const bet = num($("#bet").value);
  $("#btn-roll").disabled = true;
  await playOnce(bet);
  $("#btn-roll").disabled = autoRunning;
});

$("#btn-clear").addEventListener("click", () => {
  state.wins = state.losses = 0;
  state.totalBets = 0;
  state.pl = 0;
  state.cursor = 0;

  // Reset wallet stats but keep balance
  state.currentWinStreak = 0;
  state.currentLossStreak = 0;
  state.maxWinStreak = 0;
  state.maxLossStreak = 0;
  state.highestBalance = state.walletBalance;
  state.lowestBalance = state.walletBalance;

  // New seeds on every reset
  generateNewSeeds();
  $("#history-body").textContent = "";
  trimHistory();
  $("#stat-winloss").textContent = "0 / 0";
  $("#stat-total").textContent = "0";
  setSigned($("#stat-balance"), 0);
  $("#stat-balance").textContent = "0.00";
  updateWalletDisplay();
  resetResult();
});

/* ---------- Auto Bettor ---------- */
let autoTimer = null,
  autoRunning = false;

function setAutoUI(running) {
  document.body.classList.toggle("is-auto", running);
  $("#btn-start").disabled = running;
  $("#btn-stop").disabled = !running;
  $("#btn-roll").disabled = running;
}

function stopAuto(reason) {
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
  const wasRunning = autoRunning;
  autoRunning = false;
  setAutoUI(false);
  if (wasRunning) setStatus("auto-status", reason || "Auto-bet stopped.", reason && reason.startsWith("Stopped:") ? "error" : "");
}

async function runAuto() {
  const baseBet = num($("#auto-bet").value);
  const stopProfit = num($("#stop-profit").value);
  const stopLoss = num($("#stop-loss").value);
  const maxBets = Math.floor(num($("#auto-count").value));
  const onWinMode = $("#onwin-mode").value;
  const onLossMode = $("#onloss-mode").value;
  const onWinPct = num($("#onwin-pct").value);
  const onLossPct = num($("#onloss-pct").value);

  if (!(baseBet > 0)) {
    setStatus("auto-status", "Enter a base bet above 0 to start.", "error");
    return;
  }

  let bet = baseBet;
  let i = 0;
  autoRunning = true;
  setAutoUI(true);
  setStatus("auto-status", "Auto-bet running…");

  const loop = async () => {
    if (!autoRunning) return;
    if (maxBets > 0 && i >= maxBets) return stopAuto(`Finished ${maxBets} bets.`);
    if (stopProfit > 0 && state.pl >= stopProfit) return stopAuto("Profit target reached.");
    if (stopLoss > 0 && -state.pl >= stopLoss) return stopAuto("Loss limit reached.");

    const speed = parseInt($("#speed").value, 10) || 250;
    document.documentElement.style.setProperty(
      "--dolly-ms",
      Math.round(Math.min(650, speed * 0.8)) + "ms"
    );

    i++;
    const res = await playOnce(bet, speed < 250);
    if (!res) return stopAuto("Stopped: not enough balance for the next bet.");

    if (res.win) {
      if (onWinMode === "increase") bet = bet * (1 + onWinPct / 100);
      else bet = baseBet;
    } else {
      if (onLossMode === "increase") bet = bet * (1 + onLossPct / 100);
      else bet = baseBet;
    }

    autoTimer = setTimeout(loop, speed);
  };
  loop();
}

$("#btn-start").addEventListener("click", runAuto);
$("#btn-stop").addEventListener("click", () => {
  stopAuto();
  document.documentElement.style.removeProperty("--dolly-ms");
});

// Wallet event listeners
$("#btn-deposit").addEventListener("click", deposit);
$("#btn-withdraw").addEventListener("click", withdraw);

/* ---------- Tabs ---------- */
(function () {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
})();

/* ---------- Init ---------- */
// Draw random seeds on load
generateNewSeeds();
syncFromChance();
updateWalletDisplay();
trimHistory();
