'use client';

import { useMemo } from 'react';
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
import { useClientsTable } from '@/hooks/use-clients-table';
import { type Invoice } from '@/types';

export function ClientsTable() {
  const {
    data,
    sortConfig,
    clientNumberFilter,
    handleClientNumberFilterChange,
    yearFilter,
    handleYearFilterChange,
    handleSort,
    paginatedData,
    selectedRow,
    setSelectedRow,
    handleDownload,
    totalItems,
    itemsPerPage,
    handleItemsPerPageChange,
    totalPages,
    currentPage,
    handlePageChange,
    getPageNumbers,
  } = useClientsTable();

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
