'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-neutral-600 hover:text-neutral-950"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
