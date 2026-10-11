import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  Menu,
  Building2,
  Scissors,
  Landmark,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface TopBarProps {
  currentTab: string;
  onOpenSearch: () => void;
  onNavigateTab: (tabId: string, itemId?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, onOpenSearch, onNavigateTab }) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    settings,
    toggleMenu,
    organizations,
    currentOrganization,
    switchOrganization,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  // Close notifications & org dropdown on outside click
  useEffect(() => {
    const handleOutside = () => {
      setNotifOpen(false);
      setOrgDropdownOpen(false);
    };
    if (notifOpen || orgDropdownOpen) {
      window.addEventListener('click', handleOutside);
      return () => window.removeEventListener('click', handleOutside);
    }
  }, [notifOpen, orgDropdownOpen]);

  // Format title and breadcrumbs
  const getBreadcrumbTitle = () => {
    const map: Record<string, { crumb: string; title: string }> = {
      dashboard: { crumb: 'Overview', title: 'Operational Dashboard' },
      vendor_dashboard: { crumb: 'Vendor Portal', title: 'Supplier Dashboard' },
      requests: { crumb: 'Requisitions', title: 'Purchase Requests' },
      approvals: { crumb: 'Governance', title: 'Department Approvals' },
      tenders: { crumb: 'Sourcing', title: 'Tenders & Bidding Management' },
      vendor_tenders: { crumb: 'Supplier', title: 'Matching Open Tenders' },
      evaluation: { crumb: 'Procurement', title: 'Bid Evaluation & Smart Scoring' },
      vendor_bids: { crumb: 'Supplier', title: 'My Submitted Bids' },
      awards: { crumb: 'Contracts', title: 'Award Decisions & Approvals' },
      vendor_contracts: { crumb: 'Supplier', title: 'Awarded Contracts' },
      orders: { crumb: 'Fulfillment', title: 'Purchase Orders (PO)' },
      deliveries: { crumb: 'Logistics', title: 'Deliveries & Store Receiving' },
      vendor_deliveries: { crumb: 'Supplier', title: 'Dispatches & Logistics' },
      payments: { crumb: 'Disbursements', title: 'Payments & Payment Vouchers' },
      vendor_payments: { crumb: 'Supplier', title: 'Remittance & Payments Received' },
      vendors: { crumb: 'Suppliers', title: 'Approved Vendor Directory' },
      budgets: { crumb: 'Finance', title: 'Department Budgets & Allocation' },
      reports: { crumb: 'Intelligence', title: 'Procurement Reports & Analytics' },
      users: { crumb: 'Administration', title: 'Users & Roles Management' },
      categories: { crumb: 'Taxonomy', title: 'Procurement Categories' },
      audit: { crumb: 'Compliance', title: 'System Audit Log (Immutable)' },
      settings: { crumb: 'Preferences', title: 'System Configuration & Settings' },
    };
    return map[currentTab] || { crumb: 'Procura', title: currentTab.toUpperCase() };
  };

  const { crumb, title } = getBreadcrumbTitle();

  // User-relevant notifications
  const userNotifs = notifications.filter((n) => {
    if (n.userId && currentUser?.id) return n.userId === currentUser.id;
    if (n.forRole && currentUser?.role) return n.forRole === currentUser.role;
    return true;
  });

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const todayNotifs = userNotifs.slice(0, 5);
  const earlierNotifs = userNotifs.slice(5, 12);

  return (
    <header className="h-14 border-b border-[#1F3A2D] bg-[#07130E] px-4 md:px-6 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left: Navigation Menu Toggle & Page Title (Section 5) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1F17] hover:bg-[#132A20] text-[#D4AF37] border border-[#1F3A2D] text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="Open Navigation Menu"
        >
          <Menu className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">Menu</span>
        </button>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8B5AB]">
            <span>{currentOrganization.name || 'Procura'}</span>
            <ChevronRight className="w-3 h-3 text-[#1F3A2D]" />
            <span className="text-[#D4AF37] font-medium">{crumb}</span>
          </div>
          <h1 className="text-sm md:text-base font-bold font-serif-heading text-[#F2EFE6] leading-tight tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search Input (Ctrl+K) */}
      <div className="max-w-md w-full px-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0D1F17] hover:bg-[#132A20] border border-[#1F3A2D] text-xs text-[#A8B5AB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="truncate">Search requests, tenders, vendors, POs...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#07130E] border border-[#1F3A2D] rounded text-[#A8B5AB]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Organization / Context Switcher */}
        {currentUser?.role === 'Vendor' ? (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#132A20] border border-[#D4AF37]/40 text-xs text-[#D4AF37] font-semibold">
            <span>Global Supplier Network</span>
          </div>
        ) : (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1F17] hover:bg-[#132A20] text-[#F2EFE6] border border-[#1F3A2D] hover:border-[#D4AF37]/50 text-xs transition-all shadow-sm"
              title="Active Organization & Scale"
            >
              {currentOrganization.type === 'sole_proprietorship' ? (
                <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
              ) : currentOrganization.type === 'mega_corporation' ? (
                <Landmark className="w-3.5 h-3.5 text-[#4F9DBF]" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-[#3FB67A]" />
              )}
              <span className="font-semibold max-w-[140px] truncate hidden sm:inline">
                {currentOrganization.name}
              </span>
              <span className="text-[10px] text-[#A8B5AB] px-1.5 py-0.2 rounded bg-[#132A20] hidden md:inline">
                {currentOrganization.type === 'sole_proprietorship'
                  ? 'Tailor / Solo'
                  : currentOrganization.type === 'mega_corporation'
                  ? 'Mega Corp'
                  : 'Enterprise'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#A8B5AB]" />
            </button>

            {/* Dropdown Menu */}
            {orgDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0D1F17] border border-[#1F3A2D] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A8B5AB] border-b border-[#1F3A2D] mb-1">
                  Switch Active Organization
                </div>
                <div className="space-y-1">
                  {organizations.map((org) => {
                    const isSelected = org.id === currentOrganization.id;
                    const Icon =
                      org.type === 'sole_proprietorship'
                        ? Scissors
                        : org.type === 'mega_corporation'
                        ? Landmark
                        : Building2;

                    return (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrganization(org.id);
                          setOrgDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-[#132A20] text-[#D4AF37] font-semibold border border-[#D4AF37]/40'
                            : 'text-[#A8B5AB] hover:text-[#F2EFE6] hover:bg-[#132A20]/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#A8B5AB]'}`} />
                        <div className="overflow-hidden">
                          <span className="block font-semibold text-xs truncate text-[#F2EFE6]">
                            {org.name}
                          </span>
                          <span className="block text-[10px] text-[#A8B5AB] truncate">
                            {org.industry}
                          </span>
                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-[#07130E] text-[#D4AF37]">
                            {org.type === 'sole_proprietorship'
                              ? 'Sole Proprietor / Small Business'
                              : org.type === 'mega_corporation'
                              ? 'Mega Corporation (Parastatal)'
                              : 'Enterprise / Corporate'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* In-App PWA Install for Phones & Laptops */}
        <PWAInstallButton />

        {/* Theme Toggle (Section 1.4) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#0D1F17] hover:bg-[#132A20] border border-[#1F3A2D] text-[#A8B5AB] hover:text-[#D4AF37] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E0A93B]" /> : <Moon className="w-4 h-4 text-[#4F9DBF]" />}
        </button>

        {/* Notifications Bell with unread badge & popover (Section 7.5) */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-[#0D1F17] hover:bg-[#132A20] border border-[#1F3A2D] text-[#A8B5AB] hover:text-[#F2EFE6] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#07130E] font-bold text-[10px] flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover: Grouped Today / Earlier */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0D1F17] border border-[#1F3A2D] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs">
              <div className="px-4 py-3 border-b border-[#1F3A2D] flex items-center justify-between bg-[#132A20]/80">
                <span className="font-bold text-[#F2EFE6]">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-[#1F3A2D]">
                {userNotifs.length === 0 ? (
                  <div className="p-6 text-center text-[#A8B5AB]">No notifications</div>
                ) : (
                  <>
                    {/* Today Group */}
                    {todayNotifs.length > 0 && (
                      <div>
                        <div className="px-4 py-1.5 bg-[#07130E] text-[10px] font-bold uppercase tracking-wider text-[#A8B5AB]">
                          Today
                        </div>
                        {todayNotifs.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.recordType === 'tender') onNavigateTab('tenders', n.recordId);
                              if (n.recordType === 'request') onNavigateTab('requests', n.recordId);
                              if (n.recordType === 'po') onNavigateTab('orders', n.recordId);
                              if (n.recordType === 'payment') onNavigateTab('payments', n.recordId);
                              setNotifOpen(false);
                            }}
                            className={`p-3 hover:bg-[#132A20] cursor-pointer transition-colors ${
                              !n.read ? 'bg-[#132A20]/40' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {n.type === 'warning' ? (
                                <AlertTriangle className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
                              ) : n.type === 'danger' ? (
                                <AlertTriangle className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />
                              ) : n.type === 'success' ? (
                                <CheckCircle className="w-4 h-4 text-[#3FB67A] shrink-0 mt-0.5" />
                              ) : (
                                <Info className="w-4 h-4 text-[#4F9DBF] shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-[#F2EFE6] flex items-center justify-between">
                                  <span>{n.title}</span>
                                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                                </div>
                                <p className="text-[11px] text-[#A8B5AB] mt-0.5 leading-relaxed">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Earlier Group */}
                    {earlierNotifs.length > 0 && (
                      <div>
                        <div className="px-4 py-1.5 bg-[#07130E] text-[10px] font-bold uppercase tracking-wider text-[#A8B5AB]">
                          Earlier
                        </div>
                        {earlierNotifs.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              setNotifOpen(false);
                            }}
                            className="p-3 hover:bg-[#132A20] cursor-pointer transition-colors opacity-80"
                          >
                            <div className="font-medium text-[#F2EFE6]">{n.title}</div>
                            <p className="text-[11px] text-[#A8B5AB] mt-0.5">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1F3A2D]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F6F4A] to-[#0F3D2A] border border-[#D4AF37] flex items-center justify-center font-bold text-xs text-[#D4AF37] shadow">
            {currentUser?.avatar || currentUser?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <span className="font-semibold text-[#F2EFE6] block leading-none">{currentUser?.fullName}</span>
            <span className="text-[10px] text-[#D4AF37] leading-none mt-0.5 block">{currentUser?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
