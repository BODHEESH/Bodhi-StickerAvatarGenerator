'use client';

import { AuthProvider } from '@/contexts/AuthContext';

type Props = {
  children: any;
};

export default function ClientAuthProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
