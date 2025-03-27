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
import { MoreVertical, Pencil, Ban, UserCheck, Trash2, XCircle, AlertTriangle, CheckCircle } from "lucide-react";

// Function to format role names
const formatRoleName = (role: string) => {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};


const getRoleBadge = (role: string) => {
  switch (role) {
    case 'super_admin':
      return <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30">Super Admin</Badge>;
    case 'school_admin':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">School Admin</Badge>;
    case 'teacher':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">Teacher</Badge>;
    case 'student':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30">Student</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

const getStatusBadge = (status: boolean) => {
  switch (status) {
    case true:
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    case false:
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Inactive
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
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
        <div className="flex items-center gap-3 py-2">
          <div className={`flex items-center justify-center h-9 w-9 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-primary/10 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {initials}
          </div>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
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
        <div className="flex items-center">
          {getRoleBadge(role)}
        </div>
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
        {getStatusBadge(isActive)}
       </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="text-sm ">{createdAt.split('T')[0]}</div>;
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