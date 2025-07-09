import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/Notfound";

// User Components
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import CoffeeForm from "./components/CoffeeForm";
import Stats from "./components/Stats";
import History from "./components/History";

// Admin & Routing
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

// UI
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import ForgotPassword from "./pages/ForgotPasword";
import { generateColors } from "@mantine/colors-generator";

const theme = createTheme({
  fontFamily: "nunito-sans",
  colors: {
    Burlywood: generateColors("#deb887"),
    Chocolate: generateColors("#d2961e"),
    Brown: generateColors("#a52a2a"),
    Bisque: generateColors("#ffe4c4"),
    Beige: generateColors("#f5f5dc"),
  },
});

function HomePage() {
  const { globalUser, isLoading, globalData } = useAuth();
  const isAuthenticated = !!globalUser;
  const isData = globalData && Object.keys(globalData).length > 0;

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  );

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {isAuthenticated && isLoading && <p>Loading Data...</p>}
      {isAuthenticated && isData && authenticatedContent}
    </Layout>
  );
}

function App() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected User Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin/dashboard-admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Not found fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
