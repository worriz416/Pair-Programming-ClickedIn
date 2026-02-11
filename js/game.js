window.addEventListener("load", function () {
  // ========== MODEL ==========

  let connections = 0;
  let clickValue = 10;
  let totalUpgradesOwned = 0;

  const upgrades = [
    { name: "LinkedIn App", desc: "+1 per click", bonus: 1, baseCost: 10, multiplier: 1.5, owned: 0 }
  ];
  const milestones = [1, 50, 500, 5000];

  // ========== DOM REFERENCES ==========

  const consDisplay = document.getElementById("connections-display");
  const clickValueDisplay = document.getElementById("click-value-display");
  const upgradesOwnedDisplay = document.getElementById("upgrades-owned-display");
  const cpsDisplay = document.getElementById("cps-display");

  const networkBtn = document.getElementById("network-btn");
  const clickFeedback = document.getElementById("click-feedback");
  const upgradesList = document.getElementById("upgrades-list");
  const rewardsList = document.getElementById("rewards-list");

  // ========== HELPERS ==========

  const getCost = (u) => Math.floor(u.baseCost * Math.pow(u.multiplier, u.owned));

  function checkRewards() {
    for (var i = 0; i < rewards.length; i++) {
      if (!rewards[i].earned && rewards[i].check()) {
        rewards[i].earned = true;
      }
    }
  }

  // ========== VIEW ==========

  function updateView() {
    consDisplay.textContent = "Connections: " + connections;
    clickValueDisplay.textContent = "Per click: " + clickValue;
    upgradesOwnedDisplay.textContent = "Upgrades owned: " + totalUpgradesOwned;
    cpsDisplay.textContent = "Per second: 0";
  }

  function displayUpgrades() {
    for (const u of upgrades) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="upgrade-name">${u.name}</span>`;
      upgradesList.appendChild(li);
    }
  }

  function buildUpgradeButtons() {
    upgradesList.innerHTML = "";
    for (var i = 0; i < upgrades.length; i++) {
      var btn = document.createElement("button");
      btn.className = "upgrade-btn";
      btn.dataset.index = i;
      upgradesList.appendChild(btn);
    }
  }

  // ========== EVENT LISTENERS ==========

  networkBtn.addEventListener("click", function () {
    connections += clickValue;
    clickFeedback.textContent = "+" + clickValue + " connections!";
    updateView();
  });

  upgradesList.addEventListener("click", function (e) {
    var btn = e.target.closest(".upgrade-btn");
    if (!btn || btn.disabled) return;
    var u = upgrades[parseInt(btn.dataset.index, 10)];
    var cost = getCost(u);
    if (connections < cost) return;

    connections -= cost;
    u.owned++;
    totalUpgradesOwned++;
    clickValue += u.bonus;

    checkRewards();
    updateView();
  });

  // ========== INIT ==========

  buildUpgradeButtons();
  buildRewardBadges();
  updateView();
  displayUpgrades();
});
