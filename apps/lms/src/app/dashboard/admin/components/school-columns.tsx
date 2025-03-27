"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, School, CheckCircle, Clock } from "lucide-react";

// Define School type
export interface School {
  id: string;
  name: string;
  code: string;
  domain: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  timezone: string;
  address?: string;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'cancelled' | 'past_due';
  maxStudents: number;
  maxTeachers: number;
  createdAt: string;
  updatedAt: string;
}

export type SchoolActionHandlers = {
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
  onViewStudents: (school: School) => void;
  onViewTeachers: (school: School) => void;
};

// Function to get status badge
const getStatusBadge = (status: School['subscriptionStatus']) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    case 'trial':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Trial
        </Badge>
      );
    case 'past_due':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Past Due
        </Badge>
      );
    case 'expired':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline" className="flex items-center gap-1">{status}</Badge>;
  }
};

export const columns = (actionHandlers: SchoolActionHandlers): ColumnDef<School>[] => [
  {
    accessorKey: "name",
    header: "School",
    cell: ({ row }) => {
      const school = row.original;
      
      return (
        <div className="flex items-center gap-3 py-2">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <School className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-normal">{school.name}</div>
            <div className="text-xs text-muted-foreground">{school.code}</div>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const school = row.original;
      const searchValue = value.toLowerCase();
      return (
        school.name.toLowerCase().includes(searchValue) ||
        school.code.toLowerCase().includes(searchValue) ||
        school.domain.toLowerCase().includes(searchValue) ||
        school.contactEmail.toLowerCase().includes(searchValue)
      );
    },
  },
  {
    accessorKey: "domain",
    header: "Domain",
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const school = row.original;
      
      return (
        <div>
          <div className="text-sm">{school.contactEmail}</div>
          <div className="text-xs text-muted-foreground">{school.contactPhone || 'No phone'}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {getStatusBadge(row.getValue("subscriptionStatus"))}
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => {
      const school = row.original;
      
      return (
        <div>
          <div className="text-sm">Students: {school.maxStudents}</div>
          <div className="text-xs text-muted-foreground">Teachers: {school.maxTeachers}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const school = row.original;
      
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border shadow-md">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actionHandlers.onEdit(school)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit school
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => actionHandlers.onViewStudents(school)}
                className="cursor-pointer"
              >
                <School className="mr-2 h-4 w-4" /> 
                View students
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => actionHandlers.onViewTeachers(school)}
                className="cursor-pointer"
              >
                <School className="mr-2 h-4 w-4" />
                View teachers
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer" 
                onClick={() => actionHandlers.onDelete(school)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete school
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]; 