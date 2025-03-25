"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserViewModel } from "@/types/admin";
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
import { MoreVertical, Pencil, Ban, UserCheck, Trash2 } from "lucide-react";

// Function to format role names
const formatRoleName = (role: string) => {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Function to get role badge styles
const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30';
    case 'school_admin':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30';
    case 'teacher':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30';
    case 'student':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700/30';
  }
};

export type UserActionHandlers = {
  onEdit: (user: UserViewModel) => void;
  onToggleStatus: (user: UserViewModel) => void;
  onDelete?: (user: UserViewModel) => void;
};

export const columns = (actionHandlers: UserActionHandlers): ColumnDef<UserViewModel>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      
      return (
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center h-9 w-9 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {initials}
          </div>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const user = row.original;
      const searchValue = value.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 font-normal border ${getRoleBadgeStyle(role)}`}
        >
          {formatRoleName(role)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      
      return (
        <div className="flex items-center">
          <span
            className={`inline-block h-2 w-2 rounded-full mr-2 ${
              isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className={isActive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border shadow-md">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => actionHandlers.onEdit(user)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actionHandlers.onToggleStatus(user)}>
                {user.isActive ? (
                  <>
                    <Ban className="h-4 w-4 mr-2 text-red-600" />
                    <span className="text-red-600">Deactivate</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Activate</span>
                  </>
                )}
              </DropdownMenuItem>
              {actionHandlers.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => actionHandlers.onDelete?.(user)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete user
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]; 