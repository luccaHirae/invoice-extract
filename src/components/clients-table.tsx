'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  FileDown,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '@/lib/handlers/invoices';
import { type Invoice } from '@/types';

// Sort types
type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  key: keyof Invoice | null;
  direction: SortDirection;
};

export function ClientsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    refetchOnWindowFocus: false,
  });

  // State for data
  const [clientNumberFilter, setClientNumberFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize state from URL on component mount
  useEffect(() => {
    const client = searchParams.get('client') || '';
    const year = searchParams.get('year') || 'all';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const perPage = Number.parseInt(searchParams.get('perPage') || '10');
    const sortKey = searchParams.get('sortKey') as keyof Invoice | null;
    const sortDir = searchParams.get('sortDir') as SortDirection;

    setClientNumberFilter(client);
    setYearFilter(year);
    setCurrentPage(page);
    setItemsPerPage(perPage);

    if (sortKey && sortDir) {
      setSortConfig({ key: sortKey, direction: sortDir });
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = (params: Record<string, string>) => {
    const url = new URL(window.location.href);

    // Update or remove each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'null') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Use Next.js router to update the URL without a full page reload
    router.push(url.pathname + url.search);
  };

  // Handle sorting
  const handleSort = (key: keyof Invoice) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);

    // Update URL with sort parameters
    updateUrl({
      client: clientNumberFilter,
      year: yearFilter,
      page: currentPage.toString(),
      perPage: itemsPerPage.toString(),
      sortKey: newSortConfig.key || '',
      sortDir: newSortConfig.direction || '',
    });
  };

  // Handle client number filter change
  const handleClientNumberFilterChange = (value: string) => {
    setClientNumberFilter(value);
    setCurrentPage(1); // Reset to first page

    // Update URL
    updateUrl({
      client: value,
      year: yearFilter,
      page: '1', // Reset to first page
      perPage: itemsPerPage.toString(),
      sortKey: sortConfig.key || '',
      sortDir: sortConfig.direction || '',
    });
  };

  // Handle year filter change
  const handleYearFilterChange = (value: string) => {
    setYearFilter(value);
    setCurrentPage(1); // Reset to first page

    // Update URL
    updateUrl({
      client: clientNumberFilter,
      year: value,
      page: '1', // Reset to first page
      perPage: itemsPerPage.toString(),
      sortKey: sortConfig.key || '',
      sortDir: sortConfig.direction || '',
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL
    updateUrl({
      client: clientNumberFilter,
      year: yearFilter,
      page: page.toString(),
      perPage: itemsPerPage.toString(),
      sortKey: sortConfig.key || '',
      sortDir: sortConfig.direction || '',
    });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    const newPerPage = Number.parseInt(value);
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page

    // Update URL
    updateUrl({
      client: clientNumberFilter,
      year: yearFilter,
      page: '1', // Reset to first page
      perPage: value,
      sortKey: sortConfig.key || '',
      sortDir: sortConfig.direction || '',
    });
  };

  // Handle download
  const handleDownload = (invoiceData: Invoice) => {
    // In a real app, this would trigger an actual download
    alert(
      `Baixando dados para o cliente ${invoiceData.clientNumber} - ${invoiceData.month} ${invoiceData.year}`
    );
  };

  // Filter and sort data
  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    // First filter the data

    let result = data
      ? data.filter((item) => {
          const matchesClientNumber =
            item.clientNumber.includes(clientNumberFilter);
          const matchesYear =
            yearFilter === 'all' || item.year.toString() === yearFilter;
          return matchesClientNumber && matchesYear;
        })
      : [];

    // Then sort the data if needed
    if (sortConfig.key && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Invoice];
        const bValue = b[sortConfig.key as keyof Invoice];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Calculate pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = result.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedData, totalPages, totalItems };
  }, [
    data,
    clientNumberFilter,
    yearFilter,
    sortConfig,
    currentPage,
    itemsPerPage,
  ]);

  // Add a function to generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the start or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }

      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Get available years for filter
  const availableYears = useMemo(() => {
    return Array.from(new Set(data?.map((item) => item.year)));
  }, [data]);

  // Render sort indicator
  const renderSortIndicator = (key: keyof Invoice) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className='ml-1 h-4 w-4' />;
    }

    if (sortConfig.direction === 'asc') {
      return <ArrowUp className='ml-1 h-4 w-4' />;
    }

    if (sortConfig.direction === 'desc') {
      return <ArrowDown className='ml-1 h-4 w-4' />;
    }

    return <ArrowUpDown className='ml-1 h-4 w-4' />;
  };

  return (
    <div className='p-4 lg:p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Faturas dos Clientes</CardTitle>
          <CardDescription>
            Aqui você pode visualizar e baixar as faturas dos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Número do Cliente'
                value={clientNumberFilter}
                onChange={(e) => handleClientNumberFilterChange(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select value={yearFilter} onValueChange={handleYearFilterChange}>
              <SelectTrigger className='w-full sm:w-[150px]'>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os Anos</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'></TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('clientNumber')}
                  >
                    <div className='flex items-center'>
                      Nº do Cliente
                      {renderSortIndicator('clientNumber')}
                    </div>
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('month')}
                  >
                    <div className='flex items-center'>
                      Mês
                      {renderSortIndicator('month')}
                    </div>
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('year')}
                  >
                    <div className='flex items-center'>
                      Ano
                      {renderSortIndicator('year')}
                    </div>
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('electricEnergyR')}
                  >
                    <div className='flex items-center justify-end'>
                      Consumo de Energia Elétrica (R$)
                      {renderSortIndicator('electricEnergyR')}
                    </div>
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('energySCEER')}
                  >
                    <div className='flex items-center justify-end'>
                      Energia SCEEE s/ICMS (R$)
                      {renderSortIndicator('energySCEER')}
                    </div>
                  </TableHead>
                  <TableHead
                    className='cursor-pointer'
                    onClick={() => handleSort('publicLightingR')}
                  >
                    <div className='flex items-center justify-end'>
                      Iluminação Pública Municipal (R$)
                      {renderSortIndicator('publicLightingR')}
                    </div>
                  </TableHead>
                  <TableHead className='text-center'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className='h-24 text-center'>
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((record) => (
                    <TableRow
                      key={record.id}
                      className={selectedRow === record.id ? 'bg-muted/50' : ''}
                      onClick={() => setSelectedRow(record.id)}
                    >
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(record);
                          }}
                        >
                          <FileDown className='h-4 w-4' />
                          <span className='sr-only'>
                            Baixar arquivo {record.clientNumber} -{' '}
                            {record.month} {record.year}
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {record.clientNumber}
                      </TableCell>
                      <TableCell>{record.month}</TableCell>
                      <TableCell>{record.year}</TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(record.electricEnergyR)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(record.energySCEER)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(record.publicLightingR)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-8'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(record);
                          }}
                        >
                          <Download className='mr-2 h-3.5 w-3.5' />
                          Baixar Fatura
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='text-sm text-muted-foreground'>
              Exibindo {paginatedData.length} de {totalItems} registros
            </div>

            <div className='flex items-center gap-4'>
              {selectedRow && (
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => {
                    const record = data?.find((r) => r.id === selectedRow);
                    if (record) handleDownload(record);
                  }}
                >
                  <Download className='mr-2 h-3.5 w-3.5' />
                  Baixar Fatura Selecionada
                </Button>
              )}

              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className='w-[145px]'>
                  <SelectValue placeholder='Itens por página' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5 por página</SelectItem>
                  <SelectItem value='10'>10 por página</SelectItem>
                  <SelectItem value='20'>20 por página</SelectItem>
                  <SelectItem value='50'>50 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 0 && (
            <Pagination className='mt-4'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) =>
                  page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
