import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfesorSidebar from '../components/profesor/ProfesorSidebar';
import RoleGuard from '../components/RoleGuard';

export default function ProfesorLayout() {
  return (
    <RoleGuard rol="profesor">
      <div className="flex min-h-screen flex-col">
        <Navbar variant="profesor" />
        <div className="flex flex-1">
          <ProfesorSidebar />
          <main className="flex-1 overflow-x-auto bg-[#f8f9f5] px-6 py-8 md:px-10">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </RoleGuard>
  );
}
