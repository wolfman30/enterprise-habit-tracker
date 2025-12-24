import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Icons } from '../constants';

const Layout: React.FC = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
      isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
    }`;
  
  const getDesktopLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Desktop Navigation (Sidebar) */}
      <nav className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white p-6 shrink-0 z-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
           <span className="bg-blue-600 text-white p-1 rounded">EH</span> Tracker
        </h1>
        <div className="space-y-2 flex-1">
          <NavLink to="/" className={getDesktopLinkClass}>
            <Icons.Home /> Today
          </NavLink>
          <NavLink to="/habits" className={getDesktopLinkClass}>
            <Icons.List /> Habits
          </NavLink>
          <NavLink to="/reports" className={getDesktopLinkClass}>
            <Icons.Chart /> Reports
          </NavLink>
        </div>
        
        <div className="pt-6 border-t border-slate-100 mt-auto">
           <div className="text-xs text-slate-400">
             Enterprise Habit Tracker v1.0
             <br />
             Logged in as user
           </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth w-full">
          <div className="max-w-2xl md:max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-12">
             <Outlet />
          </div>
        </main>

        {/* Mobile Navigation (Bottom) */}
        <nav className="md:hidden border-t border-slate-200 bg-white h-16 shrink-0 flex items-center justify-around z-20">
          <NavLink to="/" className={getLinkClass}>
            <Icons.Home />
            <span className="mt-1">Today</span>
          </NavLink>
          <NavLink to="/habits" className={getLinkClass}>
            <Icons.List />
            <span className="mt-1">Habits</span>
          </NavLink>
          <NavLink to="/reports" className={getLinkClass}>
            <Icons.Chart />
            <span className="mt-1">Reports</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Layout;