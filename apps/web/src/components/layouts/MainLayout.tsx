import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  onCreate?: () => void;
}

export function MainLayout({ children, onCreate }: MainLayoutProps) {
  return (
    <>
      {children}
      <BottomNav onCreate={onCreate} />
    </>
  );
} 