import { ClientsTable } from '@/components/clients-table';
import { Suspense } from 'react';

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientsTable />
    </Suspense>
  );
}
