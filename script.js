const scoring = {
  encryption: { wpa3: 30, wpa2: 20, wep: 5 },
  adminPassword: { strong: 25, medium: 15, weak: 0 },
  firmware: { monthly: 20, yearly: 10, rarely: 0 },
  firewall: { yes: 15, unknown: 7, no: 0 },
  guest: { yes: 10, no: 3 }
};

const tipsMap = {
  encryption: "Use WPA3 (or WPA2 if WPA3 is unavailable).",
  adminPassword: "Set a long, unique admin password and never use defaults.",
  firmware: "Keep firmware updated to patch known vulnerabilities.",
  firewall: "Enable your router firewall and verify settings.",
  guest: "Use a guest network to isolate visitor devices."
};

const form = document.getElementById("securityForm");
const result = document.getElementById("result");
const meterFill = document.getElementById("meterFill");
const scoreText = document.getElementById("scoreText");
const tipsList = document.getElementById("tips");
const meter = document.querySelector(".meter");

function getBand(score) {
  if (score >= 75) return { label: "Strong", className: "high" };
  if (score >= 45) return { label: "Moderate", className: "medium" };
  return { label: "Weak", className: "low" };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    encryption: document.getElementById("encryption").value,
    adminPassword: document.getElementById("adminPassword").value,
    firmware: document.getElementById("firmware").value,
    firewall: document.getElementById("firewall").value,
    guest: document.getElementById("guest").value
  };

  let score = 0;
  const tips = [];

  for (const [key, choice] of Object.entries(values)) {
    score += scoring[key][choice] || 0;

    const maxForCategory = Math.max(...Object.values(scoring[key]));
    if ((scoring[key][choice] || 0) < maxForCategory) {
      tips.push(tipsMap[key]);
    }
  }

  const { label, className } = getBand(score);

  result.classList.remove("hidden");
  meterFill.className = `meter-fill ${className}`;
  meterFill.style.width = `${score}%`;
  meter.setAttribute("aria-valuenow", String(score));
  scoreText.textContent = `Score: ${score}/100 — ${label}`;

  tipsList.innerHTML = "";
  if (tips.length === 0) {
    tipsList.innerHTML = "<li>Great setup. Keep reviewing your settings regularly.</li>";
  } else {
    tips.forEach((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      tipsList.appendChild(item);
    });
  }
});
