import Dashboard from "./pages/dashboard/index";
import Layout from "./components/Layout";
import Profile from "./pages/profile";

export default function App() {
  return (
    <>
      <Layout>
        <Profile />
        {/* <Dashboard /> */}
      </Layout>
    </>
  );
}
