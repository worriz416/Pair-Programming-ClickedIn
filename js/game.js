window.addEventListener("load", function () {
  // ========== MODEL ==========

  var connections = 0;
  var clickValue = 1;
  var totalUpgradesOwned = 0;

  var upgrades = [
    { name: "LinkedIn App", desc: "+1 per click", bonus: 1, baseCost: 10, multiplier: 1.5, owned: 0 },
    { name: "Network Person", desc: "+5 per click", bonus: 5, baseCost: 50, multiplier: 1.5, owned: 0 },
    { name: "Computer Access", desc: "+25 per click", bonus: 25, baseCost: 250, multiplier: 1.5, owned: 0 }
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

  // ========== VIEW ==========

  function updateView() {
    consDisplay.textContent = "Connections: " + connections;
    clickValueDisplay.textContent = "Per click: " + clickValue;
    upgradesOwnedDisplay.textContent = "Upgrades owned: " + totalUpgradesOwned;
    cpsDisplay.textContent = "Per second: 0";

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
    updateView();
  });

  // ========== INIT ==========

  buildUpgradeButtons();
  updateView();
});
