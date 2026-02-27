import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

import CompanyDashboard from "./pages/CompanyDashboard";
import CreateInternship from "./pages/CreateInternship";
import CompanyApplications from "./pages/CompanyApplications";
import CreateCompany from "./pages/CreateCompany";
import CompanyProfile from "./pages/CompanyProfile";

// ✅ YENİ: şirketin kendi ilanları sayfası
import CompanyInternships from "./pages/CompanyInternships";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowRoles={["User"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowRoles={["User"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowRoles={["User"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* COMPANY */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/create"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CreateCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/profile"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        {/* ✅ YENİ: sadece şirketin açtığı ilanlar */}
        <Route
          path="/company/internships"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CompanyInternships />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/create-internship"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CreateInternship />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/applications"
          element={
            <ProtectedRoute allowRoles={["Company"]}>
              <CompanyApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}