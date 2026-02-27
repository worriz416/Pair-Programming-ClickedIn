// Liam Klein
// 2/25/2026
// JS File for ClickedIn game, includes model, view, and controller logic

window.addEventListener("load", function () {
  // ========== MODEL ==========

  let connections = 0;
  let clickValue = 1;
  let totalUpgradesOwned = 0;
  let rewardsEarned = {};

  var rewards = [
    { id: "first-click", name: "First Click", desc: "Make your first click", condition: function() { return connections > 0; }, icon: "👆", earned: false },
    { id: "novice-networker", name: "Novice Networker", desc: "Reach 100 connections", condition: function() { return connections >= 100; }, icon: "🌟", earned: false },
    { id: "professional-networker", name: "Professional Networker", desc: "Reach 1,000 connections", condition: function() { return connections >= 1000; }, icon: "⭐", earned: false },
    { id: "first-upgrade", name: "First Upgrade", desc: "Buy your first upgrade", condition: function() { return totalUpgradesOwned >= 1; }, icon: "🎁", earned: false },
    { id: "upgrade-collector", name: "Upgrade Collector", desc: "Buy 5 upgrades", condition: function() { return totalUpgradesOwned >= 5; }, icon: "🏆", earned: false },
    { id: "speed-demon", name: "Speed Demon", desc: "Reach 10 connections per second", condition: function() { return getPerSecond() >= 10; }, icon: "⚡", earned: false }
  ];

  var upgrades = [
    { name: "ClickedIn App", desc: "+0.1/sec", bonus: 0, perSec: 0.1, baseCost: 15, multiplier: 1.25, owned: 0 },
    { name: "Energy Drink", desc: "+0.1/click", bonus: 0.1, perSec: 0, baseCost: 20, multiplier: 1.25, owned: 0 },
    { name: "Network Person", desc: "+0.5/sec", bonus: 0, perSec: 0.5, baseCost: 50, multiplier: 1.25, owned: 0 },
    { name: "Computer Access", desc: "+1/sec", bonus: 0, perSec: 1, baseCost: 250, multiplier: 1.35, owned: 0 },
    { name: "ClickedIn Premium", desc: "+1/click", bonus: 1, perSec: 0, baseCost: 500, multiplier: 1.35, owned: 0 },
    { name: "Networking Event", desc: "+5/click", bonus: 5, perSec: 0, baseCost: 3000, multiplier: 1.4, owned: 0 }
  ];

  // ========== DOM REFERENCES ==========

  var consDisplay = document.getElementById("connections-display");
  var clickValueDisplay = document.getElementById("click-value-display");
  var upgradesOwnedDisplay = document.getElementById("upgrades-owned-display");
  var cpsDisplay = document.getElementById("cps-display");
  var networkBtn = document.getElementById("network-btn");
  var clickFeedback = document.getElementById("click-feedback");
  var upgradesList = document.getElementById("upgrades-list");
  var rewardsList = document.getElementById("rewards-list");
  var helpBtn = document.getElementById("help-btn");
  var helpModal = document.getElementById("help-modal");
  var closeHelpBtn = document.getElementById("close-help");
  var helpUpgradesDiv = document.getElementById("help-upgrades");
  var helpRewardsDiv = document.getElementById("help-rewards");

  // ========== HELPERS ==========

  /**
   * Calculates the cost of an upgrade based on amount owned
   *
   * @param {Object} u - The upgrade object with baseCost, multiplier, and owned properties
   * @returns {Number} The calculated cost for the next purchase of this upgrade
   */
  function getCost(u) {
    return Math.floor(u.baseCost * Math.pow(u.multiplier, u.owned));
  }

  /**
   * Calculates total connections earned per second from all upgrades
   *
   * @returns {Number} Total connections per second, rounded to 1 decimal place
   */
  function getPerSecond() {
    var total = 0;
    for (var i = 0; i < upgrades.length; i++) {
      total += upgrades[i].perSec * upgrades[i].owned;
    }
    return Math.round(total * 10) / 10;
  }

  /**
   * Checks all reward conditions and triggers reward notifications if earned
   *
   * @returns {void}
   */
  function checkRewards() {
    for (var i = 0; i < rewards.length; i++) {
      var reward = rewards[i];
      if (!reward.earned && reward.condition()) {
        reward.earned = true;
        showCongratulations(reward);
        updateRewardsDisplay();
      }
    }
  }

  /**
   * Displays a congratulations message for earned reward that fades out after 3 seconds
   *
   * @param {Object} reward - The reward object with name and desc properties
   * @returns {void}
   */
  function showCongratulations(reward) {
    var message = document.createElement("div");
    message.className = "congratulations";
    message.innerHTML = "<h2>🎉 Congratulations! 🎉</h2><p>You earned: <strong>" + reward.name + "</strong></p><p>" + reward.desc + "</p>";
    document.body.appendChild(message);
    
    setTimeout(function() {
      message.classList.add("fade-out");
      setTimeout(function() {
        message.remove();
      }, 500);
    }, 3000);
  }

  /**
   * Updates the display of earned rewards in the rewards section
   *
   * @returns {void}
   */
  function updateRewardsDisplay() {
    rewardsList.innerHTML = "";
    for (var i = 0; i < rewards.length; i++) {
      var reward = rewards[i];
      if (reward.earned) {
        var rewardDiv = document.createElement("div");
        rewardDiv.className = "reward-item earned";
        rewardDiv.title = reward.name + ": " + reward.desc;
        rewardDiv.innerHTML = "<span class='reward-icon'>" + reward.icon + "</span><span class='reward-name'>" + reward.name + "</span>";
        rewardsList.appendChild(rewardDiv);
      }
    }
  }

  // ========== VIEW ==========

  /**
   * Updates all displayed stats and upgrade buttons on the page
   *
   * @returns {void}
   */
  function updateView() {
    consDisplay.textContent = Math.round(connections);
    clickValueDisplay.textContent = Math.round(clickValue * 10) / 10;
    upgradesOwnedDisplay.textContent = totalUpgradesOwned;
    cpsDisplay.textContent = getPerSecond();

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

    checkRewards();
  }

  /**
   * Creates upgrade buttons for each upgrade in the upgrades list
   *
   * @returns {void}
   */
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
    
    // Create floating feedback element
    var feedback = document.createElement("div");
    feedback.className = "floating-feedback";
    feedback.textContent = "+" + Math.round(clickValue) + " connections!";
    document.getElementById("click-area").appendChild(feedback);
    
    // Trigger animation and remove after completion
    setTimeout(function() {
      feedback.classList.add("float-up");
    }, 10);
    
    setTimeout(function() {
      feedback.remove();
    }, 1500);
    
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

  /**
   * Populates the help modal with upgrade and reward information
   * Dynamically generates HTML for all upgrades and rewards
   *
   * @returns {void}
   */
  function populateHelpContent() {
    // Populate upgrades in help
    helpUpgradesDiv.innerHTML = "";
    for (var i = 0; i < upgrades.length; i++) {
      var u = upgrades[i];
      var upgradeDiv = document.createElement("div");
      upgradeDiv.className = "upgrade-item";
      upgradeDiv.innerHTML = 
        "<h4>" + u.name + "</h4>" +
        "<div class='detail'>" + u.desc + "</div>" +
        "<div class='detail'><span class='upgrade-cost'>Base Cost: " + u.baseCost + "</span></div>";
      helpUpgradesDiv.appendChild(upgradeDiv);
    }

    // Populate rewards in help
    helpRewardsDiv.innerHTML = "";
    for (var i = 0; i < rewards.length; i++) {
      var r = rewards[i];
      var rewardDiv = document.createElement("div");
      rewardDiv.className = "reward-item-help";
      rewardDiv.innerHTML = 
        "<h4><span class='reward-icon-help'>" + r.icon + "</span>" + r.name + "</h4>" +
        "<div class='detail'>" + r.desc + "</div>";
      helpRewardsDiv.appendChild(rewardDiv);
    }
  }

  // Help modal event listeners
  helpBtn.addEventListener("click", function() {
    helpModal.classList.remove("hidden");
    populateHelpContent();
  });

  closeHelpBtn.addEventListener("click", function() {
    helpModal.classList.add("hidden");
  });

  helpModal.addEventListener("click", function(e) {
    if (e.target === helpModal) {
      helpModal.classList.add("hidden");
    }
  });

  // ========== INIT ==========

  buildUpgradeButtons();
  updateView();
  updateRewardsDisplay();

  setInterval(function () {
    var cps = getPerSecond();
    if (cps > 0) {
      connections += cps;
      updateView();
    }
  }, 1000);
});
