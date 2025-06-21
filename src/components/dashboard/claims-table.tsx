'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Claim } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const RiskBadge = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => (
  <Badge
    variant="outline"
    className={cn(
      'border-transparent',
      level === 'Low' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      level === 'Medium' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      level === 'High' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    )}
  >
    {level} Risk
  </Badge>
);

const StatusBadge = ({ status }: { status: Claim['status'] }) => (
  <Badge
    variant="secondary"
    className={cn(
      status === 'Approved' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      status === 'Investigation' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      status === 'Rejected' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    )}
  >
    {status}
  </Badge>
);

export function ClaimsTable({ claims }: { claims: Claim[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim ID</TableHead>
            <TableHead>Claimant</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map(claim => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/claims/${claim.id}`} className="hover:underline text-primary">
                  {claim.id}
                </Link>
              </TableCell>
              <TableCell>{claim.claimant.name}</TableCell>
              <TableCell>${claim.amount.toLocaleString()}</TableCell>
              <TableCell>{claim.riskScore}%</TableCell>
              <TableCell>
                <RiskBadge level={claim.riskLabel} />
              </TableCell>
              <TableCell>
                <StatusBadge status={claim.status} />
              </TableCell>
              <TableCell>{format(new Date(claim.submittedAt), 'PP')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/claims/${claim.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Mark as Investigation</DropdownMenuItem>
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
