import { getInvoices } from '@/lib/handlers/invoices';
import { Invoice } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Sort types
type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  key: keyof Invoice | null;
  direction: SortDirection;
};

export function useClientsTable() {
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

  return {
    selectedRow,
    setSelectedRow,
    handleSort,
    handleClientNumberFilterChange,
    handleYearFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleDownload,
    paginatedData,
    totalPages,
    totalItems,
    getPageNumbers,
    availableYears,
    data,
    sortConfig,
    clientNumberFilter,
    yearFilter,
    itemsPerPage,
    currentPage,
  };
}
