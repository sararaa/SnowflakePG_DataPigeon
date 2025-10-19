'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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

type CommandItem = {
  icon: any;
  label: string;
  href?: string;
  action?: string;
};

const commands: { group: string; items: CommandItem[] }[] = [
  {
    group: 'Navigation',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { icon: MapPin, label: 'Locations', href: '/locations' },
      { icon: Ticket, label: 'Tickets', href: '/tickets' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics' },
      { icon: Brain, label: 'Predictive Maintenance', href: '/predictive' },
      { icon: Activity, label: 'Self-Healing Log', href: '/self-healing' },
      { icon: Bell, label: 'Alerts', href: '/alerts' },
    ],
  },
  {
    group: 'Quick Actions',
    items: [
      { icon: Ticket, label: 'Create New Ticket', action: 'create-ticket' },
      { icon: Zap, label: 'Restart All Critical Chargers', action: 'restart-critical' },
      { icon: Activity, label: 'Run System Diagnostics', action: 'diagnostics' },
    ],
  },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = (href?: string, action?: string) => {
    setCommandPaletteOpen(false);
    if (href) {
      router.push(href);
    }
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.label}
                onSelect={() => handleSelect(item.href, item.action)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
