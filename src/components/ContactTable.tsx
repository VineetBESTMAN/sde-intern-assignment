import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { formatPhoneNumber } from '../lib/utils';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
}

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Contact>();

  const columns = [
    columnHelper.accessor('firstName', {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>First Name</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
    }),
    columnHelper.accessor('lastName', {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Last Name</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => (
        <a href={`mailto:${info.getValue()}`} className="text-indigo-600 hover:text-indigo-900">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => formatPhoneNumber(info.getValue()),
    }),
    columnHelper.accessor('company', {
      header: ({ column }) => (
        <button
          className="flex items-center space-x-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Company</span>
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
    }),
    columnHelper.accessor('jobTitle', {
      header: 'Job Title',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1 text-blue-600 hover:text-blue-900"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 text-red-600 hover:text-red-900"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: contacts,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}