'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, Menu, Table } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PdfUploadDialog } from '@/components/pdf-upload-dialog';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', icon: BarChart3, path: '/' },
  { name: 'Faturas', icon: Table, path: '/biblioteca' },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = sidebarItems.find((item) => item.path === pathname)?.name;
  const PageIcon = sidebarItems.find((item) => item.path === pathname)?.icon;

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Sidebar for larger screens */}
      <aside className='hidden w-64 border-r bg-muted/40 lg:block'>
        <div className='flex h-full flex-col'>
          <div className='flex h-14 items-center border-b px-4'>
            <h2 className='text-lg font-semibold'>Acme</h2>
          </div>
          <nav className='flex-1 space-y-1 p-2'>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant='ghost'
                  className={cn(
                    'w-full justify-start',
                    pathname === item.path
                      ? 'bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )}
                  asChild
                >
                  <Link href={item.path} scroll={false}>
                    <Icon className='mr-2 h-4 w-4' />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='h-8 w-8 lg:hidden'>
            <Menu className='h-4 w-4' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-64 p-0'>
          <div className='flex h-full flex-col'>
            <div className='flex h-14 items-center border-b px-4'>
              <h2 className='text-lg font-semibold'>Acme</h2>
            </div>
            <nav className='flex-1 space-y-1 p-2'>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant='ghost'
                    className={cn(
                      'w-full justify-start',
                      pathname === item.path
                        ? 'bg-muted/50 text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50'
                    )}
                    asChild
                  >
                    <Link href={item.path}>
                      <Icon className='mr-2 h-4 w-4' />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className='flex flex-1 flex-col'>
        {/* Header */}
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              {PageIcon && <PageIcon className='mr-2 inline h-4 w-4' />}
              <h1 className='text-lg font-semibold'>{pageTitle}</h1>
            </div>
          </div>

          <div className='hidden lg:flex'>
            <PdfUploadDialog />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
