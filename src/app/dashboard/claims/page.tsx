import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClaimsTable } from '@/components/dashboard/claims-table';
import { mockClaims } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Claims Management</h1>
            <p className="text-muted-foreground">
              Review, analyze, and process all insurance claims.
            </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/new-claim">
                <PlusCircle />
                <span>New Claim</span>
            </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
            <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <div className="w-full max-w-sm">
                <Input placeholder="Search by Policy No. or Claimant..." />
            </div>
        </div>
        <TabsContent value="all">
          <ClaimsTable claims={mockClaims} />
        </TabsContent>
        <TabsContent value="pending">
          <ClaimsTable claims={mockClaims.filter(c => c.status === 'Pending')} />
        </TabsContent>
        <TabsContent value="investigation">
          <ClaimsTable claims={mockClaims.filter(c => c.status === 'Investigation')} />
        </TabsContent>
        <TabsContent value="approved">
          <ClaimsTable claims={mockClaims.filter(c => c.status === 'Approved')} />
        </TabsContent>
        <TabsContent value="rejected">
          <ClaimsTable claims={mockClaims.filter(c => c.status === 'Rejected')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
