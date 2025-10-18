'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  MapPin,
  Ticket,
  BarChart3,
  Brain,
  Activity,
  Bell,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Locations',
    href: '/locations',
    icon: MapPin,
  },
  {
    title: 'Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Predictive',
    href: '/predictive',
    icon: Brain,
  },
  {
    title: 'Self-Healing',
    href: '/self-healing',
    icon: Activity,
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: Bell,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? '80px' : '240px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card/50 backdrop-blur-lg"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-border px-4">
          <motion.div
            initial={false}
            animate={{
              opacity: sidebarCollapsed ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {!sidebarCollapsed && (
              <>
                <Zap className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  EVCharge
                </span>
              </>
            )}
          </motion.div>
          {sidebarCollapsed && <Zap className="h-6 w-6 text-blue-500" />}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 transition-all',
                    isActive && 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3',
              sidebarCollapsed && 'justify-center px-2'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
            {!sidebarCollapsed && (
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">Demo User</span>
                <span className="text-xs text-muted-foreground">admin@evcharge.io</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
