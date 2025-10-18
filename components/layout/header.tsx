'use client';

import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, setCommandPaletteOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-full items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 max-w-md">
          <div
            className="relative cursor-pointer"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search chargers, tickets, locations... (⌘K)"
              className="pl-10 cursor-pointer"
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-semibold">Notifications</div>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-red-500">Critical Alert</span>
                  <span className="text-sm text-muted-foreground">
                    Charger CHG-001 temperature exceeds threshold
                  </span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-orange-500">High Priority Ticket</span>
                  <span className="text-sm text-muted-foreground">
                    TKT-A1B2C3D4 SLA breach in 30 minutes
                  </span>
                  <span className="text-xs text-muted-foreground">15 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-blue-500">System Update</span>
                  <span className="text-sm text-muted-foreground">
                    5 chargers updated to firmware v2.1.0
                  </span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
