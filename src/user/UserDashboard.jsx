import CoffeeForm from "../components/CoffeeForm";
import Hero from "../components/Hero";
import History from "../components/History";
import Stats from "../components/Stats";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { globalUser, globalData, isLoading } = useAuth();
  const isAuthenticated = !!globalUser;
  const isData = globalData && Object.keys(globalData).length > 0;

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {isAuthenticated && isLoading && <p>Loading Data...</p>}
      {isAuthenticated && isData && (
        <>
          <Stats />
          <History />
        </>
      )}
    </Layout>
  );
}
