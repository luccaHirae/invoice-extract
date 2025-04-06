import { ClientsTable } from '@/components/clients-table';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function InvoicesPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center'>
          <Loader2 className='animate-spin' />
        </div>
      }
    >
      <ClientsTable />
    </Suspense>
  );
}
