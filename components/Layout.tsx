
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Package, 
  CheckSquare, 
  Sparkles,
  Menu,
  X,
  ChevronRight,
  LogOut,
  UserRound,
  Bell
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-50 text-indigo-600 font-semibold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</span>
    {!collapsed && <span className="text-sm">{label}</span>}
    {active && !collapsed && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

const BottomNavItem: React.FC<{ icon: React.ReactNode; active: boolean; onClick: () => void; label: string }> = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-2 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<{ 
  children: React.ReactNode, 
  activeTab: string, 
  onTabChange: (tab: string) => void,
  onLogout: () => void,
  user: any,
  isSuperAdmin: boolean
}> = ({ children, activeTab, onTabChange, onLogout, user, isSuperAdmin }) => {
  const [collapsed, setCollapsed] = useState(false);

  const getInitials = (user: any) => {
    if (!user) return '??';
    const email = user.email || '';
    const metadata = user.user_metadata || {};
    const name = metadata.full_name || email.split('@')[0] || 'User';
    
    return name
      .split(/[\s._-]+/)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getInitials(user);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className={`hidden md:flex bg-white border-r border-slate-200 transition-all duration-300 flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">A</div>
          {!collapsed && <span className="font-bold text-xl tracking-tight text-slate-900">Aspire</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem collapsed={collapsed} icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
          <SidebarItem collapsed={collapsed} icon={<Users size={20} />} label="Clients" active={activeTab === 'clients'} onClick={() => onTabChange('clients')} />
          <SidebarItem collapsed={collapsed} icon={<Calendar size={20} />} label="Bookings" active={activeTab === 'bookings'} onClick={() => onTabChange('bookings')} />
          <SidebarItem collapsed={collapsed} icon={<Package size={20} />} label="Packages" active={activeTab === 'packages'} onClick={() => onTabChange('packages')} />
          
          {isSuperAdmin && (
            <>
              <SidebarItem collapsed={collapsed} icon={<CheckSquare size={20} />} label="Tasks" active={activeTab === 'tasks'} onClick={() => onTabChange('tasks')} />
              <SidebarItem collapsed={collapsed} icon={<UserRound size={20} />} label="Employees" active={activeTab === 'employees'} onClick={() => onTabChange('employees')} />
            </>
          )}

          <SidebarItem collapsed={collapsed} icon={<Sparkles size={20} />} label="AI Studio" active={activeTab === 'ai'} onClick={() => onTabChange('ai')} />
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-200">
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-semibold">Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400">
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <span className="font-bold text-slate-900">Aspire</span>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="group relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 border border-indigo-200 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:shadow-lg transition-all">
                {userInitials}
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-black">Account</p>
                  <p className="text-xs font-semibold text-black truncate">{user?.email}</p>
                  {isSuperAdmin && <p className="text-[9px] text-indigo-600 font-bold uppercase mt-1">Super Admin</p>}
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex justify-around px-2 z-20">
          <BottomNavItem label="Home" icon={<LayoutDashboard size={20} />} active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
          <BottomNavItem label="Clients" icon={<Users size={20} />} active={activeTab === 'clients'} onClick={() => onTabChange('clients')} />
          <BottomNavItem label="Bookings" icon={<Calendar size={20} />} active={activeTab === 'bookings'} onClick={() => onTabChange('bookings')} />
          {isSuperAdmin && (
            <>
              <BottomNavItem label="Tasks" icon={<CheckSquare size={20} />} active={activeTab === 'tasks'} onClick={() => onTabChange('tasks')} />
              <BottomNavItem label="Staff" icon={<UserRound size={20} />} active={activeTab === 'employees'} onClick={() => onTabChange('employees')} />
            </>
          )}
        </nav>
      </main>
    </div>
  );
};
