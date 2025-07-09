import { useAuth } from "../context/AuthContext";
import {
  calculateCoffeeStats,
  calculateCurrentCaffeineLevel,
  getTopThreeCoffees,
  statusLevels,
} from "../Service";
import { Table } from "@mantine/core";

function StatCard(props) {
  const { lg, title, children } = props;
  return (
    <div className={"card stat-card" + (lg ? "col-span-2" : "")}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export default function Stats() {
  const { globalData } = useAuth();
  const history = globalData?.coffeeConsumptionHistory || {};
  const stats = calculateCoffeeStats(history);
  const caffeineLevel = calculateCurrentCaffeineLevel(history);
  const warningLevel =
    caffeineLevel < statusLevels["low"].maxLevel
      ? "low"
      : caffeineLevel < statusLevels["moderate"].maxLevel
      ? "moderate"
      : "high";

  const topCoffees = getTopThreeCoffees(history);
  const coffeeRows = topCoffees.map((coffee, index) => (
    <Table.Tr key={index}>
      <Table.Td>{coffee.coffeeName}</Table.Td>
      <Table.Td>{coffee.count}</Table.Td>
      <Table.Td>{coffee.percentage}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="flex items-center ml-6">
        <i className="fa-solid fa-chart-simple"></i>
        <h2 className="ml-2 font-mono font-bold text-md">Stats</h2>
      </div>
      <div className="ml-6 font-mono">
        <StatCard lg title="Active Caffeine Level">
          <div className="status">
            <p>
              <span className="stat-text">{caffeineLevel}</span> mg
            </p>
            <h5
              style={{
                color: statusLevels[warningLevel].color,
                background: statusLevels[warningLevel].background,
                border: "2px solid",
                width: 150,
                textAlign: "center",
                borderRadius: 10,
                marginTop: 3,
              }}
            >
              {warningLevel}
            </h5>
          </div>
          <p className="mt-2 mb-2">{statusLevels[warningLevel].description}</p>
        </StatCard>

        <StatCard title="Daily Caffeine">
          <p>
            <span className="stat-text">{stats.daily_caffeine}</span> mg
          </p>
        </StatCard>
        <StatCard title="Avg # of Coffees">
          <p>
            <span className="stat-text">{stats.average_coffees}</span>
          </p>
        </StatCard>
        <StatCard title="Daily Cost ($)">
          <p>
            $ <span className="stat-text">{stats.daily_cost}</span>
          </p>
        </StatCard>
        <StatCard title="Total Cost ($)">
          <p>
            $ <span className="stat-text">{stats.total_cost}</span>
          </p>
        </StatCard>

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          mt={6}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Coffee Name</Table.Th>
              <Table.Th>Number of Purchase</Table.Th>
              <Table.Th>Percentage of Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{coffeeRows}</Table.Tbody>
        </Table>
      </div>
    </>
  );
}
