import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import DashboardUser from "./pages/user/DashboardUser"
import CreateReport from "./pages/user/CreateReport"
import ReportsUser from "./pages/user/ReportsUser"
import DetailReport from "./pages/user/DetailReport"
import EditReport from "./pages/user/EditReport"
import ProfileUser from "./pages/user/ProfileUser"

import DashboardAdmin from "./pages/admin/DashboardAdmin"
import DataPelapor from "./pages/admin/DataPelapor"
import DataKategori from "./pages/admin/DataKategori"
import KelolaPengaduan from "./pages/admin/KelolaPengaduan"
import DetailPengaduan from "./pages/admin/DetailPengaduan"
import ProfileAdmin from "./pages/admin/ProfileAdmin"
import DetailUserAdmin from "./pages/admin/DetailUserAdmin"

import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin"
import ProfileSuperAdmin from "./pages/superadmin/ProfileSuperAdmin"
import LaporanSuperAdmin from "./pages/superadmin/LaporanSuperAdmin"
import DetailUserSuperAdmin from "./pages/superadmin/DetailUserSuperAdmin"

import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"
import SuperAdminLayout from "./layouts/SuperAdminLayout"

import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
          <Route path="/user/dashboard" element={<DashboardUser />} />
          <Route path="/user/create-report" element={<CreateReport />} />
          <Route path="/user/reports" element={<ReportsUser />} />
          <Route path="/user/detail-report/:id" element={<DetailReport />} />
          <Route path="/user/edit-report/:id" element={<EditReport />} />
          <Route path="/user/profile" element={<ProfileUser />} />
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["admin","super_admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/pelapor" element={<DataPelapor />} />
          <Route path="/admin/categories" element={<DataKategori />} />
          <Route path="/admin/pengaduan" element={<KelolaPengaduan />} />
          <Route path="/admin/detail-report/:id" element={<DetailPengaduan />} />
          <Route path="/admin/profile" element={<ProfileAdmin />} />
          <Route path="/admin/user/:id" element={<DetailUserAdmin />} />
        </Route>

        {/* SUPER ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminLayout /></ProtectedRoute>}>
          <Route path="/superadmin/dashboard" element={<DashboardSuperAdmin />} />
          <Route path="/superadmin/laporan" element={<LaporanSuperAdmin />} />
          <Route path="/superadmin/profile" element={<ProfileSuperAdmin />} />
          <Route path="/superadmin/user/:id" element={<DetailUserSuperAdmin />} />
          <Route path="/superadmin/detail-report/:id" element={<DetailPengaduan />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  )
}