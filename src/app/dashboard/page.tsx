'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { ClaimsChart } from '@/components/dashboard/claims-chart';
import { RecentClaims } from '@/components/dashboard/recent-claims';
import { useClaims } from '@/hooks/use-claims';

export default function DashboardPage() {
  const { claims } = useClaims();
  const highRiskClaims = claims.filter(c => c.riskLabel === 'High').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          A real-time summary of claim activities and fraud risk analysis.
        </p>
      </div>

      <OverviewStats claims={claims} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Claims by Risk Level</CardTitle>
            <CardDescription>Distribution of claims based on AI-assessed risk.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ClaimsChart claims={claims} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent High-Risk Claims</CardTitle>
            <CardDescription>Claims needing immediate attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentClaims claims={highRiskClaims} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
