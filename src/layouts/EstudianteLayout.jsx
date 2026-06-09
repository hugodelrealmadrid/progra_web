import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoleGuard from '../components/RoleGuard';

export default function EstudianteLayout() {
  return (
    <RoleGuard rol="estudiante">
      <div className="flex min-h-screen flex-col">
        <Navbar variant="estudiante" />
        <main className="flex-1 bg-amc-palido">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RoleGuard>
  );
}
