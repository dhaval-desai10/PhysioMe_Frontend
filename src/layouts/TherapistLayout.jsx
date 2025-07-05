import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Calendar,
  Users,
  Dumbbell,
  ClipboardList,
  Video,
  User,
  Settings,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function TherapistLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    {
      to: '/therapist/dashboard',
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      to: '/therapist/appointments',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Appointments'
    },
    {
      to: '/therapist/patients',
      icon: <Users className="w-5 h-5" />,
      label: 'My Patients'
    },
    {
      to: '/therapist/exercises',
      icon: <Dumbbell className="w-5 h-5" />,
      label: 'Exercise Library'
    },
    {
      to: '/therapist/treatment-plans',
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'Treatment Plans'
    },
    {
      to: '/therapist/video-sessions',
      icon: <Video className="w-5 h-5" />,
      label: 'Video Sessions'
    },
    {
      to: '/therapist/profile',
      icon: <User className="w-5 h-5" />,
      label: 'My Profile'
    },
    {
      to: '/therapist/notifications',
      icon: <Bell className="w-5 h-5" />,
      label: 'Notifications'
    },
    {
      to: '/therapist/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">PhysioMe</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMobileMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'}
            lg:block
            lg:w-64
            bg-white
            border-r
            fixed
            lg:sticky
            top-0
            h-screen
            overflow-y-auto
            z-30
          `}
        >
          {/* Logo */}
          <div className="hidden lg:flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold">PhysioMe</h1>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}