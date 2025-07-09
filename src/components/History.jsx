import { useAuth } from "../context/AuthContext";
import {
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  timeSinceConsumption,
} from "../Service";

export default function History() {
  const { globalData } = useAuth();
  const rawHistory = globalData?.coffeeConsumptionHistory || {};

  // 🔁 Normalisasi agar semua entri pakai `coffeeName` & `price`
  const history = Object.fromEntries(
    Object.entries(rawHistory).map(([utcTime, entry]) => [
      utcTime,
      {
        coffeeName: entry.coffeeName || entry.name || "Unknown",
        price: entry.price || entry.cost || 0,
      },
    ])
  );

  return (
    <>
      <div className="flex items-center font-mono font-bold ml-6 mt-3">
        <i className="fa-solid fa-timeline"></i>
        <h2 className="ml-3">History</h2>
      </div>
      <p className="font-mono ml-6">
        <i>Hover for more information!</i>
      </p>
      <div className="coffee-history flex items-center ml-6 flex-wrap gap-2 mt-2">
        {Object.keys(history)
          .sort((a, b) => b - a)
          .map((utcTime, index) => {
            const coffee = history[utcTime];
            const { coffeeName, price } = coffee;

            if (!coffeeName || coffeeName === "Unknown") return null; // ⛔️ Skip unknown

            const timeSinceConsume = timeSinceConsumption(utcTime);
            const originalAmount = getCaffeineAmount(coffeeName);
            const remainingAmount = calculateCurrentCaffeineLevel({
              [utcTime]: coffee,
            });

            const summary = `${coffeeName} | ${timeSinceConsume} | $${price} | ${remainingAmount}mg / ${originalAmount}mg`;

            return (
              <div
                key={index}
                title={summary}
                className="text-lg text-yellow-700 cursor-pointer"
              >
                <i className="fa-solid fa-mug-saucer" />
              </div>
            );
          })}
      </div>
    </>
  );
}
