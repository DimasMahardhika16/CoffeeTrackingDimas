export const statusLevels = {
  low: {
    color: "#047857",
    background: "#d1fae5",
    description:
      "Caffeine levels are mild, resulting in a light boost in alertness with minimal side effects.",
    maxLevel: 100,
  },
  moderate: {
    color: "#b45309",
    background: "#fef3c7",
    description:
      "A moderate amount of caffeine leads to noticeable stimulation, increased focus, and potential restlessness.",
    maxLevel: 200,
  },
  high: {
    color: "#e11d48",
    background: "#ffe4e6",
    description:
      "Elevated caffeine levels can cause jitteriness, rapid heartbeat, and trouble concentrating, signaling an excessive intake.",
    maxLevel: 9999,
  },
};

export const coffeeOptions = [
  { name: "Espresso", caffeine: 63, category: "coffee" },
  { name: "Double Espresso", caffeine: 126, category: "coffee" },
  { name: "Americano", caffeine: 96, category: "coffee" },
  { name: "Cappuccino", caffeine: 80, category: "coffee" },
  { name: "Latte", caffeine: 80, category: "coffee" },
  { name: "Mocha", caffeine: 90, category: "coffee" },
  { name: "Macchiato", caffeine: 85, category: "coffee" },
  { name: "Flat White", caffeine: 130, category: "coffee" },
  { name: "Cortado", caffeine: 85, category: "coffee" },
  { name: "Red Eye", caffeine: 159, category: "coffee" },
  { name: "Black Coffee (8oz)", caffeine: 95, category: "coffee" },
  { name: "Iced Coffee (8oz)", caffeine: 90, category: "coffee" },
  { name: "Cold Brew (12oz)", caffeine: 155, category: "coffee" },
  { name: "Nitro Cold Brew (12oz)", caffeine: 215, category: "coffee" },
  { name: "Drip Coffee (12oz)", caffeine: 120, category: "coffee" },
  { name: "Frappuccino", caffeine: 95, category: "coffee" },
  { name: "Turkish Coffee", caffeine: 160, category: "coffee" },
  { name: "Irish Coffee", caffeine: 70, category: "coffee" },
  { name: "Vietnamese Coffee", caffeine: 100, category: "coffee" },
  { name: "Affogato", caffeine: 65, category: "coffee" },
  { name: "Instant Coffee (1 tsp)", caffeine: 30, category: "coffee" },
  { name: "Decaf Coffee", caffeine: 2, category: "coffee" },
  { name: "Chai Latte", caffeine: 0, category: "non-caffeine" },
  { name: "Matcha Latte", caffeine: 0, category: "non-caffeine" },
  { name: "Monster Energy (16oz)", caffeine: 160, category: "coffee" },
  { name: "Red Bull (8.4oz)", caffeine: 80, category: "coffee" },
  { name: "Rockstar Energy (16oz)", caffeine: 160, category: "coffee" },
  { name: "Bang Energy (16oz)", caffeine: 300, category: "coffee" },
  { name: "Celsius Energy Drink (12oz)", caffeine: 200, category: "coffee" },
  { name: "5-hour Energy (2oz)", caffeine: 200, category: "coffee" },
  { name: "NOS Energy Drink (16oz)", caffeine: 160, category: "coffee" },
  { name: "Reign Energy Drink (16oz)", caffeine: 300, category: "coffee" },
  { name: "Starbucks Doubleshot (6.5oz)", caffeine: 135, category: "coffee" },
  { name: "Monster Java (15oz)", caffeine: 188, category: "coffee" },
  { name: "AMP Energy Drink (16oz)", caffeine: 142, category: "coffee" },
  { name: "Zipfizz (1 tube)", caffeine: 100, category: "coffee" },
];

// Digunakan untuk menghitung total kafein aktif saat ini
export function calculateCurrentCaffeineLevel(historyData) {
  const currentTime = Date.now();
  const halfLife = 5 * 60 * 60 * 1000;
  const maxAge = 48 * 60 * 60 * 1000;
  let totalCaffeine = 0;

  for (const [timestamp, entry] of Object.entries(historyData)) {
    const timeElapsed = currentTime - parseInt(timestamp);
    if (timeElapsed <= maxAge) {
      const caffeineInitial = getCaffeineAmount(entry.coffeeName);
      const remainingCaffeine =
        caffeineInitial * Math.pow(0.5, timeElapsed / halfLife);
      totalCaffeine += remainingCaffeine;
    }
  }

  return totalCaffeine.toFixed(2);
}

// Mendapatkan jumlah kafein dari nama kopi
export function getCaffeineAmount(coffeeName) {
  const coffee = coffeeOptions.find((c) => c.name === coffeeName);
  return coffee ? coffee.caffeine : 0;
}

// Menghitung 3 jenis kopi yang paling sering dikonsumsi
export function getTopThreeCoffees(historyData) {
  const coffeeCount = {};
  for (const entry of Object.values(historyData)) {
    const coffeeName = entry.coffeeName;
    if (!coffeeName) continue;
    coffeeCount[coffeeName] = (coffeeCount[coffeeName] || 0) + 1;
  }

  const sorted = Object.entries(coffeeCount).sort((a, b) => b[1] - a[1]);
  const total = Object.values(coffeeCount).reduce((a, b) => a + b, 0);

  return sorted.slice(0, 3).map(([name, count]) => ({
    coffeeName: name,
    count,
    percentage: ((count / total) * 100).toFixed(2) + "%",
  }));
}

// Menghitung berapa lama sejak konsumsi kopi
export function timeSinceConsumption(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  const d = days % 30,
    h = hours % 24,
    m = minutes % 60,
    s = seconds % 60;

  let result = "";
  if (months) result += `${months}M `;
  if (d) result += `${d}D `;
  if (h) result += `${h}H `;
  if (m) result += `${m}M `;
  if (!result || s) result += `${s}S`;

  return result.trim();
}

// Statistik harian dan total
export function calculateCoffeeStats(historyData) {
  const dailyStats = {};
  let totalCoffees = 0,
    totalCost = 0,
    totalCaffeine = 0;

  for (const [timestamp, entry] of Object.entries(historyData)) {
    const time = parseInt(timestamp);
    if (isNaN(time)) continue;

    const date = new Date(time).toISOString().split("T")[0];
    const caffeine = getCaffeineAmount(entry.coffeeName);
    const cost = parseFloat(entry.price || entry.cost || 0);

    if (!dailyStats[date]) {
      dailyStats[date] = { caffeine: 0, cost: 0, count: 0 };
    }

    dailyStats[date].caffeine += caffeine;
    dailyStats[date].cost += cost;
    dailyStats[date].count += 1;

    totalCoffees++;
    totalCost += cost;
    totalCaffeine += caffeine;
  }

  return {
    dailyStats,
    totalCoffees,
    totalCost: totalCost.toFixed(2),
    totalCaffeine,
    averageCaffeine:
      totalCoffees > 0 ? (totalCaffeine / totalCoffees).toFixed(2) : "0",
  };
}
