import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Layout from "../components/Layout";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  Input,
  Select,
  TextInput,
  Title,
  Divider,
} from "@mantine/core";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [caffeine, setCaffeine] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null); // null = add mode

  // === USER FETCH ===
  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDocs(collection(db, "users"));
      const userList = userSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const menuSnap = await getDocs(collection(db, "menus"));
      const menuList = menuSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);
      setMenus(menuList);
      setLoading(false);
    };

    fetchData();
  }, []);

  const isInactive = (lastActive) => {
    if (!lastActive) return true;
    const now = dayjs();
    const last = dayjs(lastActive.toDate());
    return now.diff(last, "day") > 30;
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // === MENU CRUD ===
  const handleMenuSubmit = async () => {
    if (!name || !category || isNaN(caffeine)) {
      alert("Please fill form and make sure caffeine number.");
      return;
    }

    const menuData = {
      name,
      caffeine: parseFloat(caffeine),
      category: category.toLowerCase(),
    };

    if (editId) {
      await updateDoc(doc(db, "menus", editId), menuData);
      setMenus((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, ...menuData } : m))
      );
    } else {
      const newDoc = await addDoc(collection(db, "menus"), menuData);
      setMenus((prev) => [...prev, { id: newDoc.id, ...menuData }]);
    }

    resetForm();
  };

  const handleEdit = (menu) => {
    setEditId(menu.id);
    setName(menu.name);
    setCaffeine(menu.caffeine);
    setCategory(menu.category);
  };

  const handleDeleteMenu = async (id) => {
    if (confirm("Are you sure delete this menu?")) {
      await deleteDoc(doc(db, "menus", id));
      setMenus((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setCaffeine("");
    setCategory("");
  };

  return (
    <Layout>
      <div className="p-6">
        <Title order={2} className="mb-4 font-mono">
          Admin Dashboard
        </Title>

        {/* USER TABLE */}
        <Title order={4} className="mt-6 mb-2 font-mono">
          User List
        </Title>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-100 font-mono">
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Last Active</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border px-2 py-1 font-mono">{user.email}</td>
                  <td className="border px-2 py-1 font-mono">{user.role}</td>
                  <td className="border px-2 py-1">
                    {user.lastActive?.toDate().toLocaleDateString() || "-"}
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-center gap-2">
                      {isInactive(user.lastActive) ? (
                        <Badge variant="dot" radius="md" color="gray">
                          Inactive
                        </Badge>
                      ) : (
                        <Badge variant="dot" radius="md" color="green">
                          Active
                        </Badge>
                      )}
                      <Button
                        variant="filled"
                        color="red"
                        size="xs"
                        radius="md"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MENU MANAGEMENT */}
        <Divider my="xl" />
        <Title order={4} className="font-mono mb-2">
          {editId ? "Edit Menu" : "Add New Menu"}
        </Title>

        <div className="flex gap-4 mb-4 flex-wrap">
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextInput
            label="Caffeine (mg)"
            type="number"
            value={caffeine}
            onChange={(e) => setCaffeine(e.target.value)}
            required
          />
          <Select
            label="Category"
            placeholder="Select category"
            value={category}
            onChange={setCategory}
            data={[
              "coffee",
              "tea",
              "chocolate",
              "matcha",
              "taro",
              "non-caffeine",
            ]}
            required
          />
          <div className="flex items-end gap-2">
            <Button
              w={80}
              onClick={handleMenuSubmit}
              variant="gradient"
              gradient={{ from: "cyan", to: "grape", deg: 90 }}
            >
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button variant="filled" color="gray" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* MENU LIST */}
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100 font-mono">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Caffeine</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="text-center">
                <td className="border px-2 py-1">{menu.name}</td>
                <td className="border px-2 py-1">{menu.caffeine} mg</td>
                <td className="border px-2 py-1">{menu.category}</td>
                <td className="border px-2 py-1">
                  <div className="flex justify-center gap-2">
                    <Button size="xs" onClick={() => handleEdit(menu)}>
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="filled"
                      color="red"
                      onClick={() => handleDeleteMenu(menu.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
