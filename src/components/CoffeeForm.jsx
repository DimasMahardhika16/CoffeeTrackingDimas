import { useEffect, useState } from "react";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import {
  Input,
  Stack,
  Grid,
  Button,
  Select,
  Group,
  Text,
  Box,
} from "@mantine/core";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { coffeeOptions } from "../Service"; // optional sebagai fallback default

export default function CoffeeForm({ isAuthenticated }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState("");
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [menuOptions, setMenuOptions] = useState(coffeeOptions); // default fallback

  const { globalData, setGlobalData, globalUser, refreshUserData } = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menuSnap = await getDocs(collection(db, "menus"));
        const firestoreMenus = menuSnap.docs.map((doc) => doc.data());

        // Menggabungkan firestoreMenus dengan coffeeOptions, lalu hilangkan duplikat berdasarkan nama
        const allMenus = [...coffeeOptions, ...firestoreMenus];

        // Mmebuat map unik berdasarkan nama
        const uniqueMenus = Array.from(
          new Map(allMenus.map((item) => [item.name, item])).values()
        );

        setMenuOptions(uniqueMenus);
      } catch (err) {
        console.error("Failed to fetch menu:", err.message);
      }
    };

    fetchMenus();
  }, []);

  const handleCloseModal = () => setShowModal(false);

  const handleResetForm = () => {
    setSelectedCoffee(null);
    setShowCoffeeTypes(false);
    setCoffeeCost("");
    setHour(0);
    setMin(0);
  };

  const handleSubmitForm = async () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    if (!selectedCoffee) {
      alert("Please select a coffee type.");
      return;
    }

    const costValue = parseFloat(coffeeCost);
    if (isNaN(costValue) || costValue < 0) {
      alert("Please enter a valid coffee cost.");
      return;
    }

    try {
      const now = Date.now();
      const subtractMs =
        Number(hour) * 60 * 60 * 1000 + Number(min) * 60 * 1000;
      const timeStamp = now - subtractMs;

      const coffeeInfo = menuOptions.find((c) => c.name === selectedCoffee);
      const caffeineValue = coffeeInfo?.caffeine || 0;

      const newEntry = {
        coffeeName: selectedCoffee,
        caffeine: caffeineValue,
        price: costValue,
        time: new Date(timeStamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const existingHistory = globalData?.coffeeConsumptionHistory || {};
      const updatedHistory = {
        ...existingHistory,
        [timeStamp]: newEntry,
      };

      const updatedData = {
        ...globalData,
        coffeeConsumptionHistory: updatedHistory,
      };

      setGlobalData(updatedData);

      const userRef = doc(db, "users", globalUser.uid);
      await setDoc(
        userRef,
        { coffeeConsumptionHistory: updatedHistory },
        { merge: true }
      );

      if (refreshUserData) await refreshUserData();

      handleResetForm();
    } catch (err) {
      console.error("Error saving data:", err.message);
    }
  };

  const handleDeleteLastEntry = async () => {
    try {
      const history = globalData?.coffeeConsumptionHistory;
      if (!history || Object.keys(history).length === 0) {
        alert("No entries to delete.");
        return;
      }

      const timestamps = Object.keys(history).map(Number);
      const latestTimestamp = Math.max(...timestamps);

      const updatedHistory = { ...history };
      delete updatedHistory[latestTimestamp];

      const updatedData = {
        ...globalData,
        coffeeConsumptionHistory: updatedHistory,
      };

      setGlobalData(updatedData);

      const userRef = doc(db, "users", globalUser.uid);
      await setDoc(
        userRef,
        { coffeeConsumptionHistory: updatedHistory },
        { merge: true }
      );

      if (refreshUserData) await refreshUserData();

      alert("Last entry deleted successfully.");
    } catch (err) {
      console.error("Error deleting entry:", err.message);
    }
  };

  return (
    <Stack>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}

      <Group ml={25}>
        <i className="fa-solid fa-pen-to-square" />
        <Text fw="bold" ff="monospace">
          Start Your Tracking Today
        </Text>
      </Group>

      <Text fw={700} ff="monospace" ml={25}>
        Please choose your coffee type
      </Text>

      <Grid justify="center" align="center" ml={25}>
        <Grid.Col span={12}>
          <Group spacing="xs">
            {menuOptions.slice(0, 5).map((option, index) => (
              <Button
                key={index}
                variant={selectedCoffee === option.name ? "filled" : "outline"}
                color="brown"
                size="lg"
                onClick={() => {
                  setSelectedCoffee(option.name);
                  setShowCoffeeTypes(false);
                }}
              >
                <Box>
                  <Text size="sm">{option.name}</Text>
                  <Text size="xs" c="black">
                    {option.caffeine} mg
                  </Text>
                </Box>
              </Button>
            ))}

            <Button
              variant={showCoffeeTypes ? "filled" : "outline"}
              color="gray"
              size="lg"
              onClick={() => {
                setShowCoffeeTypes(true);
                setSelectedCoffee(null);
              }}
            >
              <Box>
                <Text size="sm">Other</Text>
                <Text size="xs" c="black">
                  n/a
                </Text>
              </Box>
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      {showCoffeeTypes && (
        <Select
          fw="bolder"
          ff="monospace"
          label="Choose type"
          placeholder="Select coffee type"
          ml={6}
          maw={250}
          data={menuOptions.map((option) => ({
            value: option.name,
            label: `${option.name} (${option.caffeine} mg)`,
          }))}
          value={selectedCoffee}
          onChange={setSelectedCoffee}
        />
      )}

      <Text fw="bold" ff="monospace" ml={25}>
        Add the Cost ($)
      </Text>
      <Input
        type="number"
        value={coffeeCost}
        onChange={(e) => setCoffeeCost(e.target.value)}
        variant="filled"
        placeholder="2.50"
        px="md"
        w={150}
        ml={15}
      />

      <Text fw="bold" ff="monospace" ml={25}>
        Time of Consumption
      </Text>
      <Group ml={25}>
        <Select
          label="Hours"
          maw={100}
          data={Array.from({ length: 24 }, (_, i) => ({
            value: i.toString(),
            label: i.toString(),
          }))}
          value={hour.toString()}
          onChange={(val) => setHour(Number(val))}
        />

        <Select
          label="Minutes"
          maw={100}
          data={[0, 5, 10, 15, 30, 45].map((m) => ({
            value: m.toString(),
            label: m.toString(),
          }))}
          value={min.toString()}
          onChange={(val) => setMin(Number(val))}
        />
      </Group>

      <Group ml={25} mt={10} mb={10}>
        <Button
          radius={5}
          color="brown"
          w={150}
          ff="monospace"
          onClick={handleSubmitForm}
        >
          Add Entry
        </Button>
        <Button
          radius={5}
          variant="filled"
          color="red"
          w={150}
          ff="monospace"
          onClick={handleDeleteLastEntry}
        >
          Delete Entry
        </Button>
      </Group>
    </Stack>
  );
}
