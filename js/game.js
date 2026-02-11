window.addEventListener("load", function () {
  // ========== MODEL ==========

  let connections = 0;
  let clickValue = 1;
  let totalUpgradesOwned = 0;

  var upgrades = [
    { name: "LinkedIn App", desc: "+0.1/click", bonus: 0, perSec: 0.1, baseCost: 15, multiplier: 1.5, owned: 0 },
    { name: "Network Person", desc: "+0.5/sec", bonus: 0, perSec: 0.5, baseCost: 50, multiplier: 1.5, owned: 0 },
    { name: "Computer Access", desc: "+1/sec", bonus: 0, perSec: 1, baseCost: 250, multiplier: 1.5, owned: 0 }
  ];

  // ========== DOM REFERENCES ==========

  var consDisplay = document.getElementById("connections-display");
  var clickValueDisplay = document.getElementById("click-value-display");
  var upgradesOwnedDisplay = document.getElementById("upgrades-owned-display");
  var cpsDisplay = document.getElementById("cps-display");
  var networkBtn = document.getElementById("network-btn");
  var clickFeedback = document.getElementById("click-feedback");
  var upgradesList = document.getElementById("upgrades-list");

  // ========== HELPERS ==========

  function getCost(u) {
    return Math.floor(u.baseCost * Math.pow(u.multiplier, u.owned));
  }

  function getPerSecond() {
    var total = 0;
    for (var i = 0; i < upgrades.length; i++) {
      total += upgrades[i].perSec * upgrades[i].owned;
    }
    return total;
  }

  // ========== VIEW ==========

  function updateView() {
    consDisplay.textContent = "Connections: " + Math.round(connections);
    clickValueDisplay.textContent = "Per click: " + clickValue;
    upgradesOwnedDisplay.textContent = "Upgrades owned: " + totalUpgradesOwned;
    cpsDisplay.textContent = "Per second: " + getPerSecond();

    var buttons = upgradesList.querySelectorAll(".upgrade-btn");
    for (var i = 0; i < upgrades.length; i++) {
      var u = upgrades[i];
      var cost = getCost(u);
      buttons[i].disabled = connections < cost;
      buttons[i].innerHTML =
        '<span class="upgrade-name">' + u.name + '</span>' +
        '<span class="upgrade-desc">' + u.desc + '</span>' +
        '<span class="upgrade-cost">Cost: ' + cost + '</span>' +
        '<span class="upgrade-owned">Owned: ' + u.owned + '</span>';
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
    clickFeedback.textContent = "+" + Math.round(clickValue) + " connections!";
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
    updateView();
  });

  // ========== INIT ==========

  buildUpgradeButtons();
  updateView();

  setInterval(function () {
    var cps = getPerSecond();
    if (cps > 0) {
      connections += cps;
      updateView();
    }
  }, 1000);
});
