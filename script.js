/* ---------- Utilities ---------- */
const $ = (s, d = document) => d.querySelector(s);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const to2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
const to4 = (x) => (Math.round(x * 10000) / 10000).toFixed(4);

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

/* ---------- Sync visuals ---------- */
function updateBar() {
  const lossPct = state.over ? state.roll : 100 - state.roll;
  $("#bar").style.setProperty("--loss-pct", to2(lossPct) + "%");
  const trackRect = $("#track").getBoundingClientRect();
  const handle = $("#handle");
  handle.style.left = 2 + (state.roll / 100) * (trackRect.width - 4) + "px";
  $("#over-under-label").textContent = state.over ? "Over" : "Under";
  const bet = parseFloat($("#bet").value || 0);
  const profit = bet * (state.multiplier - 1);
  $("#profit").value = to2(profit);
}

function syncFromChance() {
  const p = clamp(state.chance, 0.01, 98) / 100;
  const edge = clamp(state.edgePct, 0, 10) / 100;
  state.multiplier = (1 - edge) / p;
  state.roll = state.over ? 100 - p * 100 : p * 100;
  $("#chance").value = to2(state.chance);
  $("#multiplier").value = to4(state.multiplier);
  $("#roll").value = to2(state.roll);
  updateBar();
}

function syncFromMultiplier() {
  const edge = clamp(state.edgePct, 0, 10) / 100;
  const p = (1 - edge) / clamp(state.multiplier, 1.0001, 1e9);
  state.chance = clamp(p * 100, 0.01, 98);
  state.roll = state.over ? 100 - state.chance : state.chance;
  $("#chance").value = to2(state.chance);
  $("#multiplier").value = to4(state.multiplier);
  $("#roll").value = to2(state.roll);
  updateBar();
}

function syncFromRoll() {
  const p = state.over
    ? (100 - clamp(state.roll, 0, 100)) / 100
    : clamp(state.roll, 0, 100) / 100;
  state.chance = p * 100;
  const edge = clamp(state.edgePct, 0, 10) / 100;
  state.multiplier = (1 - edge) / p;
  $("#chance").value = to2(state.chance);
  $("#multiplier").value = to4(state.multiplier);
  $("#roll").value = to2(state.roll);
  updateBar();
}

function syncFromEdge() {
  const edge = clamp(state.edgePct, 0, 10) / 100;
  const p = clamp(state.chance, 0.01, 98) / 100;
  state.multiplier = (1 - edge) / p;
  $("#multiplier").value = to4(state.multiplier);
  updateBar();
}

/* ---------- Wallet functions ---------- */
function updateWalletDisplay() {
  $("#wallet-balance").textContent = to2(state.walletBalance);
  $("#stat-highest").textContent = to2(state.highestBalance);
  $("#stat-lowest").textContent = to2(state.lowestBalance);
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
  const amount = parseFloat($("#deposit-amount").value || 0);
  if (amount <= 0) {
    alert("Montant invalide pour le dépôt");
    return;
  }

  updateWalletBalance(amount);
  log(`💰 Dépôt de ${to2(amount)} USDC effectué`);
}

function withdraw() {
  const amount = parseFloat($("#deposit-amount").value || 0);
  if (amount <= 0) {
    alert("Montant invalide pour le retrait");
    return;
  }

  if (amount > state.walletBalance) {
    alert("Solde insuffisant pour ce retrait");
    return;
  }

  updateWalletBalance(-amount);
  log(`💸 Retrait de ${to2(amount)} USDC effectué`);
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

/* ---------- Draggable handle ---------- */
(function () {
  const track = $("#track");
  const handle = $("#handle");
  let dragging = false;
  function setFromClientX(clientX) {
    const rect = track.getBoundingClientRect();
    let pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    state.roll = +(pct * 100).toFixed(2);
    syncFromRoll();
  }
  handle.addEventListener("mousedown", (e) => {
    dragging = true;
    handle.style.cursor = "grabbing";
    e.preventDefault();
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
    handle.style.cursor = "grab";
  });
  window.addEventListener("mousemove", (e) => {
    if (dragging) setFromClientX(e.clientX);
  });
  track.addEventListener("click", (e) => setFromClientX(e.clientX));
})();

/* ---------- Inputs ---------- */
$("#chance").addEventListener("input", (e) => {
  state.chance = +e.target.value;
  syncFromChance();
});
$("#multiplier").addEventListener("input", (e) => {
  state.multiplier = +e.target.value;
  syncFromMultiplier();
});
$("#roll").addEventListener("input", (e) => {
  state.roll = +e.target.value;
  syncFromRoll();
});
$("#edge").addEventListener("input", (e) => {
  state.edgePct = +e.target.value;
  syncFromEdge();
});
$("#bet").addEventListener("input", updateBar);

$("#btn-under").addEventListener("click", () => {
  state.over = false;
  $("#btn-under").classList.add("active");
  $("#btn-over").classList.remove("active");
  syncFromChance(); // Use syncFromChance to maintain same probability
});
$("#btn-over").addEventListener("click", () => {
  state.over = true;
  $("#btn-over").classList.add("active");
  $("#btn-under").classList.remove("active");
  syncFromChance(); // Use syncFromChance to maintain same probability
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
}

$("#btn-new-seeds").addEventListener("click", generateNewSeeds);

$("#btn-hash").addEventListener("click", async () => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode($("#server-seed").value || "server")
  );
  const hex = [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  log(`Server seed hash: ${hex}`);
});

["server-seed", "client-seed", "nonce"].forEach((id) => {
  $("#" + id).addEventListener("input", (e) => {
    if (id === "nonce") state.nonce = +e.target.value || 0;
    else state[id.replace("-", "")] = e.target.value;
  });
});

/* ---------- Rolling logic ---------- */
function isWin(roll) {
  return state.over ? roll > state.roll : roll < state.roll;
}

function log(msg, cls = "") {
  const el = document.createElement("div");
  el.textContent = msg;
  el.className = "log " + cls;
  $("#console").appendChild(el);
  $("#console").scrollTop = $("#console").scrollHeight;
}

async function playOnce(betAmt) {
  // Vérifier si le joueur a assez de fonds
  if (betAmt > state.walletBalance) {
    alert("Solde insuffisant pour cette mise !");
    return { win: false, profit: 0 };
  }

  const roll = await getRoll();
  const win = isWin(roll);
  const profit = win ? betAmt * (state.multiplier - 1) : -betAmt;

  // Mettre à jour le portefeuille
  updateWalletBalance(profit);

  // Mettre à jour les séries de victoires/défaites
  updateWinLossStreaks(win);

  state.pl += profit;
  state.totalBets++;
  if (win) state.wins++;
  else state.losses++;
  $("#stat-last").textContent = to2(roll);
  $("#stat-winloss").textContent = `${state.wins} / ${state.losses}`;
  $("#stat-total").textContent = state.totalBets;
  $("#stat-balance").textContent = to2(state.pl);
  log(
    `Roll ${to2(roll)} — ${win ? "WIN" : "LOSE"} — ${
      profit >= 0 ? "+" : ""
    }${to2(profit)} USDC — Solde: ${to2(state.walletBalance)} USDC`,
    win ? "win" : "lose"
  );
  return { win, profit };
}

$("#btn-roll").addEventListener("click", async () => {
  const bet = parseFloat($("#bet").value) || 0;
  $("#btn-roll").disabled = true;
  await playOnce(bet);
  $("#btn-roll").disabled = false;
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

  // Génère de nouvelles seeds automatiquement lors du reset
  generateNewSeeds();
  $("#console").textContent = "";
  $("#stat-last").textContent = "—";
  $("#stat-winloss").textContent = "0 / 0";
  $("#stat-total").textContent = "0";
  $("#stat-balance").textContent = "0.00";
  updateWalletDisplay();
});

/* ---------- Auto Bettor ---------- */
let autoTimer = null,
  autoRunning = false;

function stopAuto() {
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
  autoRunning = false;
  $("#btn-start").disabled = false;
  $("#btn-stop").disabled = true;
}

async function runAuto() {
  const baseBet = parseFloat($("#auto-bet").value) || 0;
  const stopProfit = parseFloat($("#stop-profit").value) || 0;
  const stopLoss = parseFloat($("#stop-loss").value) || 0;
  const maxBets = parseInt($("#auto-count").value || 0, 10);
  const onWinMode = $("#onwin-mode").value;
  const onLossMode = $("#onloss-mode").value;
  const onWinPct = parseFloat($("#onwin-pct").value) || 0;
  const onLossPct = parseFloat($("#onloss-pct").value) || 0;

  let bet = baseBet;
  let i = 0;
  autoRunning = true;
  $("#btn-start").disabled = true;
  $("#btn-stop").disabled = false;

  const loop = async () => {
    if (!autoRunning) return;
    if (maxBets > 0 && i >= maxBets) return stopAuto();
    if (stopProfit > 0 && state.pl >= stopProfit) return stopAuto();
    if (stopLoss > 0 && -state.pl >= stopLoss) return stopAuto();

    i++;
    const { win } = await playOnce(bet);

    if (win) {
      if (onWinMode === "increase") bet = bet * (1 + onWinPct / 100);
      else bet = baseBet;
    } else {
      if (onLossMode === "increase") bet = bet * (1 + onLossPct / 100);
      else bet = baseBet;
    }

    // Utilise la vitesse sélectionnée
    const speed = parseInt($("#speed").value) || 250;
    autoTimer = setTimeout(loop, speed);
  };
  loop();
}

$("#btn-start").addEventListener("click", runAuto);
$("#btn-stop").addEventListener("click", stopAuto);

// Wallet event listeners
$("#btn-deposit").addEventListener("click", deposit);
$("#btn-withdraw").addEventListener("click", withdraw);

/* ---------- Init ---------- */
// Génère automatiquement des seeds aléatoires au chargement
generateNewSeeds();
syncFromChance();
updateBar();
updateWalletDisplay();
