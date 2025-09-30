import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  PieChart, 
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { WalletConnect, WalletStatus } from './WalletConnect';
import { useWalletStore } from '../stores/walletStore';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isConnected } = useWalletStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [openMobileGroup, setOpenMobileGroup] = React.useState<string | null>(null);

  type NavItem = { name: string; href: string; icon: React.ComponentType<any> };
  type NavGroup = { name: string; icon: React.ComponentType<any>; items: NavItem[] };

  const navigation: (NavItem | NavGroup)[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
      name: 'Actions',
      icon: Zap,
      items: [
        { name: 'Deposit', href: '/deposit', icon: ArrowDownToLine },
        { name: 'Withdraw', href: '/withdraw', icon: ArrowUpFromLine },
      ],
    },
    {
      name: 'Insights',
      icon: PieChart,
      items: [
        { name: 'History', href: '/history', icon: History },
        { name: 'Vault Status', href: '/vault', icon: PieChart },
      ],
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const isGroupActive = (group: NavGroup) => group.items.some(i => isActivePath(i.href));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  Cross-Chain Vault
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center flex-1 justify-center space-x-6 lg:space-x-8">
              {navigation.map((item) => {
                const Icon = (item as any).icon;
                if ('href' in item) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          isActivePath(item.href)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                }

                const group = item as NavGroup;
                const groupActive = isGroupActive(group);
                return (
                  <div key={group.name} className="relative group">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer select-none transition-colors
                        ${
                          groupActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {group.name}
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg min-w-[180px] p-2">
                      {group.items.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                            ${
                              isActivePath(sub.href)
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <sub.icon className="w-4 h-4" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Wallet Connection & Status */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <WalletStatus />
              <WalletConnect showBalance={isConnected} />

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = (item as any).icon;
                if ('href' in item) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                        ${
                          isActivePath(item.href)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                }

                const group = item as NavGroup;
                const isOpen = openMobileGroup === group.name;
                const groupActive = isGroupActive(group);
                return (
                  <div key={group.name} className="rounded-md">
                    <button
                      onClick={() => setOpenMobileGroup(isOpen ? null : group.name)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                        ${
                          groupActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" /> {group.name}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="mt-1 space-y-1 pl-8">
                        {group.items.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileGroup(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-base transition-colors
                              ${
                                isActivePath(sub.href)
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            <sub.icon className="w-5 h-5" /> {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Zap className="w-4 h-4" />
              <span>Powered by ZetaChain Cross-Chain Technology</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>Total Value Locked: $8.55M</span>
              <span>•</span>
              <span>Active Users: 1,234</span>
              <span>•</span>
              <span>Supported Chains: 4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};