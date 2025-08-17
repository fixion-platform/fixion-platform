import LoginPage from '../src/pages/LoginPage'
import LoginPageII from '../src/pages/LoginPageII'
import Dashboard from "./pages/dashboard/index";
import Layout from "./components/Layout";
import Profile from "./pages/profile";
import ErrorPageV from '../src/pages/ErrorPageV'
import ErrorPageVI from '../src/pages/ErrorPageVI'
import ErrorPageVII from '../src/pages/ErrorPageVII'
import ErrorPageVIII from '../src/pages/ErrorPageVIII'

function App() {
  return (
    <div>
      <Dashboard/>
    </div>
  )
}

export default App

  /*return (
    <>
      <Layout>
        <Profile />
        { <Dashboard /> }
      </Layout>
    </>
  );*/


