import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import LoginPage from "./Pages/LoginPage";
import CartPage from "./Pages/CartPage";
import DoctorCategoryPage from "./Pages/DoctorCategoryPage";
import DoctorListPage from "./Pages/DoctorListPage";
import MyBookings from "./Pages/MyBookings";
import LabCategoryPage from "./Pages/LabCategoryPage";
import LabTestPage from "./Pages/LabTestPage";
import PackagesPage from "./Pages/PackagesPage";
import ScanAndXRayPage from "./Pages/ScanAndXRayPage";
import PrescriptionPage from "./Pages/PrescriptionPage";
import DiagnosticsPage from "./Pages/DiagnosticsPage";
import WalletPage from "./Pages/WalletPage";

function App() {
  return (
    <Router>
      {/* Google Translate Widget at the Top */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/doctor-category/:category/:type" element={<DoctorCategoryPage />} />
        <Route path="/doctor-list/:categoryName" element={<DoctorListPage />} />
        <Route path="/mybookings" element={<MyBookings />} />
         <Route path="/lab-category" element={<LabCategoryPage />} />
          <Route path="/labtest" element={<LabTestPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/scan&xrays" element={<ScanAndXRayPage />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </Router>
  );
}

export default App;
