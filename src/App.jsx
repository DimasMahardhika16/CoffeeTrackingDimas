import CoffeeForm from "./components/CoffeeForm";
import Hero from "./components/Hero";
import History from "./components/History";
import Layout from "./components/Layout";
import Stats from "./components/Stats";
import { useAuth } from "./context/AuthContext";
import { coffeeConsumptionHistory } from "./Service";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  fontFamily: "nunito-sans",
});

function App() {
  const { globalUser, isLoading, globalData } = useAuth();
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length;

  const authenticatedContent = (
    <>
      <MantineProvider theme={theme}>
        <Stats />
        <History />
      </MantineProvider>
    </>
  );

  return (
    <>
      <MantineProvider theme={theme}>
        <Layout>
          <Hero />
          <CoffeeForm isAuthenticated={isAuthenticated} />
          {isAuthenticated && isLoading && <p>Loading Data...</p>}
          {isAuthenticated && isData && authenticatedContent}
        </Layout>
      </MantineProvider>
    </>
  );
}

export default App;
