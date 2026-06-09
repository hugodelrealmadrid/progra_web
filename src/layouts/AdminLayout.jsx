import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/admin/AdminSidebar';
import Footer from '../components/Footer';
import AdminGuard from '../components/AdminGuard';
import { AdminDataProvider } from '../context/AdminDataContext';

export default function AdminLayout() {
  return (
    <AdminGuard>
      <AdminDataProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar variant="admin" />
          <div className="flex flex-1">
            <AdminSidebar />
            <main className="flex-1 overflow-x-auto bg-white px-6 py-8 md:px-10">
              <Outlet />
            </main>
          </div>
          <Footer />
        </div>
      </AdminDataProvider>
    </AdminGuard>
  );
}
