import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';

export function Root() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Barangay Resident Profiling System</h1>
          <p className="text-blue-100 text-sm mt-1">Resident Information Management</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                isActive('/')
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/residents"
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                isActive('/residents')
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Residents
            </Link>
            <Link
              to="/residents/add"
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                isActive('/residents/add')
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Add Resident
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>&copy; 2026 Barangay Resident Profiling System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
