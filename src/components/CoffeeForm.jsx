import { coffeeOptions } from "../Service/index";
import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useAuth } from "../context/AuthContext";
import { Input, Stack, Grid, Button, Select } from "@mantine/core";

export default function CoffeeForm(props) {
  const { isAuthenticated } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, setGlobalData, globalUser } = useAuth();

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    if (!selectedCoffee) {
      return;
    }

    try {
      const nowTime = Date.now();
      const timeToSubtract = hour * 60 * 60 * 1000 + min * 60 * 1000; // Perbaiki 60 * 100 jadi 60 * 1000
      const timeStamp = nowTime - timeToSubtract;

      const newData = {
        name: selectedCoffee,
        cost: coffeeCost,
      };

      // Update local state
      const newGlobalData = {
        ...(globalData || {}),
        [timeStamp]: newData,
      };
      setGlobalData(newGlobalData);

      // Update Firestore
      const userRef = doc(db, "users", globalUser.uid);
      await setDoc(userRef, { [timeStamp]: newData }, { merge: true });

      console.log("Saved:", timeStamp, selectedCoffee, coffeeCost);

      setSelectedCoffee(null);
      setHour(0);
      setMin(0);
      setCoffeeCost(0);
    } catch (err) {
      console.error("Failed to save coffee data:", err.message);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <Stack>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <div className="flex items-center gap-1 ml-6">
        <i className="fa-solid fa-pen-to-square"></i>
        <h2 className="font-bold font-mono ml-3"> Start Your Tracking Today</h2>
      </div>
      <h4 className="font-bold font-mono ml-6">
        Please choose your coffee type
      </h4>
      <Grid justify="center" align="center" ml={10}>
        <Grid.Col span={12}>
          {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
            return (
              <button
                onClick={() => {
                  setSelectedCoffee(option.name);
                  setShowCoffeeTypes(false);
                }}
                className={
                  "button-card ml-2 border-2 cursor-pointer" +
                  (option.name === selectedCoffee
                    ? "coffee-button-selected"
                    : "")
                }
                key={optionIndex}
              >
                <h4>{option.name}</h4>
                <p>{option.caffeine} mg</p>
              </button>
            );
          })}
          <button
            onClick={() => {
              setShowCoffeeTypes(true);
              setSelectedCoffee(null);
            }}
            className={
              "button-card ml-2 mt-2 border-2 cursor-pointer" +
              (showCoffeeTypes ? "coffee-button-selected" : "")
            }
          >
            <h4>Other</h4>
            <p>n/a</p>
          </button>
        </Grid.Col>
      </Grid>
      {showCoffeeTypes && (
        <select
          className="w-100 ml-3 border-2 rounded-md"
          onChange={(e) => {
            setSelectedCoffee(e.target.value);
          }}
          name="coffee-list"
          id="coffee-list"
        >
          <option value={null}>Choose type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine} mg)
              </option>
            );
          })}
        </select>
      )}
      <h4 className="font-bold font-mono ml-6">Add the Cost ($)</h4>
      <Input
        onChange={(e) => {
          setCoffeeCost(e.target.value);
        }}
        variant="filled"
        placeholder="2.50"
        type="number"
        value={coffeeCost}
        px={"md"}
        w={150}
        ml={6}
      />
      <h4 className="font-bold font-mono ml-6">Time of Consumption</h4>
      <div className="container-hours">
        <h6 className="font-normal font-mono">Hours</h6>
        <select
          onChange={(e) => {
            setHour(e.target.value);
          }}
          id="hours-select"
        >
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].map((hour, hourIndex) => {
            return (
              <option key={hourIndex} value={hour}>
                {hour}
              </option>
            );
          })}
        </select>
      </div>
      <div className="container-mins">
        <h6 className="font-normal font-mono">Mins</h6>
        <select
          onChange={(e) => {
            setMin(e.target.value);
          }}
          id="mins-select"
        >
          {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
            return (
              <option key={minIndex} value={min}>
                {min}
              </option>
            );
          })}
        </select>
      </div>
      <Button
        radius={5}
        color="rgba(112, 46, 8, 1)"
        w={150}
        ml={20}
        ff={"monospace"}
        className="mb-5"
        onClick={handleSubmitForm}
      >
        Add Entry
      </Button>
    </Stack>
  );
}
