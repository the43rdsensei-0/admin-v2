import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Authorize from "./pages/Authorize";
import Dashboard from "./pages/Dashboard";
import AdminAccess from "./pages/Dashboard/AdminAccess";
import AddAdminUser from "./pages/Dashboard/AdminAccess/AdminUser/AddAdminUser";
import AdminUser from "./pages/Dashboard/AdminAccess/AdminUser";
import AdminUserList from "./pages/Dashboard/AdminAccess/AdminUsersList";
import Customers from "./pages/Dashboard/Customers";
import { CustomersList, CustomerDetails } from "./pages/Dashboard/Customers";
import RateModifier from "./pages/Dashboard/RateModifier";
import CryptoRateModifier from "./pages/Dashboard/RateModifier/components/CryptoRateModifier/CryptoRateModifier";
import GiftcardsRateModifier from "./pages/Dashboard/RateModifier/components/GiftcardsRateModifier";
import Transactions from "./pages/Dashboard/Transactions";
import TransactionDetails from "./pages/Dashboard/Transactions/TransactionDetails";
import TransactionsList from "./pages/Dashboard/Transactions/TransactionsList";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminUserDetails from "./pages/Dashboard/AdminAccess/AdminUser/AdminUserDetails";
import Activities from "./pages/Dashboard/Activities";
import { Suspense } from "react";
import ComponentLoader from "./components/Loaders/ComponentLoader";
import Overview from "./pages/Dashboard/Overview";
import PageLoader from "./components/Loaders/PageLoader";
import Profile from "./pages/Dashboard/Profile";
import TransactionsHistory from "./pages/Dashboard/Profile/TransactionsHistory";
import Verifications from "./pages/Dashboard/Verifications";
import VerificationsList from "./pages/Dashboard/Verifications/VerificationsList";
import VerificationsDetails from "./pages/Dashboard/Verifications/VerificationsDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={ <ProtectedRoute children={<Login />} /> } />
        <Route path='/dashboard' element={<ProtectedRoute children={<Dashboard />} /> }>
          
          <Route path="" element={<Authorize child={<Suspense children={<Overview />} fallback={<PageLoader />} />} roles={['admin_org', 'admin_ops', 'admin_mktg']} />}  />

          <Route path="assets" element={<Authorize child={<RateModifier/>} roles={['admin_org', 'admin_ops', 'admin_acct', 'admin_asset_man']} />} >
            <Route path="" element={<CryptoRateModifier />} />
            <Route path="crypto" element={<CryptoRateModifier />} />
            <Route path="giftcards" element={<GiftcardsRateModifier />} />
          </Route>
x
          <Route path='customers'  element={<Authorize child={<Customers />} roles={['admin_org', 'admin_ops', 'admin_mktg']} />}>
            <Route path="" element={<CustomersList />} />
            <Route path=":customerId" element={<CustomerDetails />} />
          </Route>

          <Route path="transactions" element={<Authorize child={<Transactions />} roles={['admin_org', 'admin_ops', 'admin_acct', 'admin_csa_crypto',  'admin_csa_card']} /> }>
            <Route path="" element={<TransactionsList />} />
            <Route path=":transactionId" element={<TransactionDetails />} />
          </Route>

          <Route path="admin-access" element={<Authorize child={<AdminAccess />} roles={['admin_org', 'admin_ops']} />}>
            <Route path="" element={<AdminUserList />} />
            <Route path="user" element={<AdminUser />}>
              <Route path="new" element={<AddAdminUser />} />
              <Route path=":userId" element={<AdminUserDetails />} />
            </Route>
          </Route>

          <Route path="verifications" element={<Authorize child={<Verifications />} roles={['admin_org',  'admin_ops']} /> }>
            <Route path="" element={<VerificationsList />} />
            <Route path=":identityId" element={<VerificationsDetails />} />
          </Route>

          <Route path="profile" element={<Authorize child={<Profile />} roles={['admin_csa_crypto',  'admin_csa_card']} /> }>
            <Route path="history" element={<TransactionsHistory />} />
          </Route>

          <Route path="activities" element={<Suspense fallback={<ComponentLoader />} children={<Authorize  child={<Activities />} roles={['admin_org', 'admin_ops']} />} /> } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
