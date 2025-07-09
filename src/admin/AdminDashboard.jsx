import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Layout from "../components/Layout";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  Select as MantineSelect,
  Menu as MantineMenu,
  ActionIcon,
  TextInput,
  Title,
  Divider,
  Table,
  Modal,
  Select,
} from "@mantine/core";
import {
  IconDots,
  IconEdit,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { statusLevels } from "../Service";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [emailSortOrder, setEmailSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("all");

  // Form state
  const [name, setName] = useState("");
  const [caffeine, setCaffeine] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null); // null = add mode
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

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

  const [viewedUser, setViewedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);

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

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditUserModalOpen(true);
  };

  const handleViewUserStats = async (user) => {
    setViewedUser(user);
    try {
      const statsRef = doc(db, "usersStats", user.id);
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        setUserStats(statsSnap.data());
      } else {
        setUserStats(null);
        alert("Statistik tidak ditemukan untuk user ini.");
      }
    } catch (err) {
      console.error("Gagal mengambil statistik:", err);
    }
  };

  const handleUpdateUser = async () => {
    if (!editEmail || !editRole) return alert("Email dan role wajib diisi");
    await updateDoc(doc(db, "users", selectedUser.id), {
      email: editEmail,
      role: editRole,
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, email: editEmail, role: editRole }
          : u
      )
    );
    setEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleResetPassword = async (user) => {
    alert(`Reset password link telah dikirim ke: ${user.email}`);
  };

  const handleConditionalDeleteUser = async (user) => {
    if (user.role === "admin") {
      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        return alert("Minimal harus ada 1 admin!");
      }
    }
    handleDeleteUser(user.id);
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
          <div className="border-4 rounded-md">
            <Table
              striped
              withTableBorder
              className="border border-gray-400 rounded-md"
            >
              <Table.Thead>
                <Table.Tr className="sticky top-0 bg-white z-10 border-b-4 border-b-gray-400 shadow-sm font-mono">
                  <Table.Th>
                    <div className="flex items-center gap-2">
                      Email
                      <Select
                        value={emailSortOrder}
                        onChange={setEmailSortOrder}
                        data={[
                          { value: "asc", label: "A-Z" },
                          { value: "desc", label: "Z-A" },
                        ]}
                        size="xs"
                        w={70}
                        variant="filled"
                      />
                    </div>
                  </Table.Th>

                  <Table.Th>
                    <div className="flex items-center gap-2">
                      Role
                      <Select
                        value={roleFilter}
                        onChange={setRoleFilter}
                        data={[
                          { value: "all", label: "All" },
                          { value: "admin", label: "Admin" },
                          { value: "user", label: "User" },
                        ]}
                        size="xs"
                        w={90}
                        variant="filled"
                      />
                    </div>
                  </Table.Th>

                  <Table.Th>Last Active</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {[...users]
                  .filter(
                    (user) => roleFilter === "all" || user.role === roleFilter
                  )
                  .sort((a, b) =>
                    emailSortOrder === "asc"
                      ? a.email.localeCompare(b.email)
                      : b.email.localeCompare(a.email)
                  )
                  .map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td
                        className="font-mono hover:underline cursor-pointer"
                        onClick={() => handleViewUserStats(user)}
                      >
                        {user.email}
                      </Table.Td>

                      <Table.Td className="font-mono">{user.role}</Table.Td>

                      <Table.Td className="font-mono">
                        {user.lastActive?.toDate().toLocaleDateString() || "-"}
                      </Table.Td>

                      <Table.Td>
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

                          <MantineMenu
                            shadow="md"
                            width={180}
                            position="bottom-end"
                          >
                            <MantineMenu.Target>
                              <ActionIcon variant="subtle">
                                <IconDots size={18} />
                              </ActionIcon>
                            </MantineMenu.Target>

                            <MantineMenu.Dropdown>
                              <MantineMenu.Item
                                icon={<IconRefresh size={14} />}
                                onClick={() => handleResetPassword(user)}
                              >
                                Reset Password
                              </MantineMenu.Item>

                              <MantineMenu.Item
                                icon={<IconEdit size={14} />}
                                onClick={() => handleEditUserClick(user)}
                              >
                                Edit User
                              </MantineMenu.Item>

                              {user.role === "user" ||
                              users.filter((u) => u.role === "admin").length >
                                1 ? (
                                <MantineMenu.Item
                                  color="red"
                                  icon={<IconTrash size={14} />}
                                  onClick={() =>
                                    handleConditionalDeleteUser(user)
                                  }
                                >
                                  Delete User
                                </MantineMenu.Item>
                              ) : null}
                            </MantineMenu.Dropdown>
                          </MantineMenu>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
        {viewedUser && userStats && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Title order={4} className="mb-2 font-mono col-span-full">
              Statistik untuk: {viewedUser.email}
            </Title>

            <div className="bg-white shadow rounded-xl p-4">
              <h4 className="font-semibold mb-2">Active Caffeine Level</h4>
              <div>
                <p>
                  <span className="text-2xl font-bold">
                    {userStats.caffeineLevel}
                  </span>{" "}
                  mg
                </p>
                <div
                  className="mt-2 text-center text-sm font-semibold"
                  style={{
                    color: statusLevels[userStats.warningLevel]?.color,
                    background:
                      statusLevels[userStats.warningLevel]?.background,
                    border: "2px solid",
                    borderRadius: 10,
                    width: 150,
                    margin: "auto",
                  }}
                >
                  {userStats.warningLevel}
                </div>
                <p className="mt-2 text-gray-600 text-sm">
                  {statusLevels[userStats.warningLevel]?.description}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h4 className="font-semibold mb-2">Daily Caffeine</h4>
              <p>
                <span className="text-2xl font-bold">
                  {userStats.daily_caffeine}
                </span>{" "}
                mg
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h4 className="font-semibold mb-2">Avg # of Coffees</h4>
              <p>
                <span className="text-2xl font-bold">
                  {userStats.averageCaffeine}
                </span>
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h4 className="font-semibold mb-2">Daily Cost ($)</h4>
              <p>
                ${" "}
                <span className="text-2xl font-bold">
                  {userStats.daily_cost}
                </span>
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h4 className="font-semibold mb-2">Total Cost ($)</h4>
              <p>
                ${" "}
                <span className="text-2xl font-bold">
                  {userStats.totalCost}
                </span>
              </p>
            </div>
          </div>
        )}
        <Modal
          opened={editUserModalOpen}
          onClose={() => setEditUserModalOpen(false)}
          title="Edit User"
          centered
        >
          <TextInput
            label="Email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.currentTarget.value)}
            required
          />
          <MantineSelect
            label="Role"
            value={editRole}
            onChange={setEditRole}
            data={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
            className="mt-4"
            required
          />
          <div className="flex justify-end mt-6">
            <Button onClick={handleUpdateUser}>Update</Button>
          </div>
        </Modal>

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
              variant="filled"
              color="Burlywood"
            >
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button variant="filled" color="Chocolate" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
        {/* MENU LIST */}
        <div className="mt-4 max-h-[400px] overflow-y-auto rounded-md border-4">
          <Table striped withTableBorder stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr className="font-mono">
                <Table.Th>
                  <div className="flex items-center gap-2">
                    Name
                    <Select
                      value={sortOrder}
                      onChange={setSortOrder}
                      data={[
                        { value: "asc", label: "A-Z" },
                        { value: "desc", label: "Z-A" },
                      ]}
                      size="xs"
                      w={70}
                      variant="filled"
                    />
                  </div>
                </Table.Th>
                <Table.Th>Caffeine</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {[...menus]
                .sort((a, b) =>
                  sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
                )
                .map((menu) => (
                  <Table.Tr key={menu.id}>
                    <Table.Td>{menu.name}</Table.Td>
                    <Table.Td>{menu.caffeine} mg</Table.Td>
                    <Table.Td>{menu.category}</Table.Td>
                    <Table.Td>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="xs"
                          color="Burlywood"
                          onClick={() => handleEdit(menu)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="filled"
                          color="Chocolate"
                          onClick={() => handleDeleteMenu(menu.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
