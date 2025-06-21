import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, FileText, XCircle } from 'lucide-react';
import type { Claim } from '@/lib/types';

export function OverviewStats({ claims }: { claims: Claim[] }) {
  const totalClaims = claims.length;
  const highRisk = claims.filter(c => c.riskLabel === 'High').length;
  const approved = claims.filter(c => c.status === 'Approved').length;
  const rejected = claims.filter(c => c.status === 'Rejected').length;

  const stats = [
    { title: 'Total Claims', value: totalClaims, icon: FileText, color: 'text-primary' },
    { title: 'High-Risk Alerts', value: highRisk, icon: AlertCircle, color: 'text-red-500' },
    { title: 'Approved', value: approved, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Rejected', value: rejected, icon: XCircle, color: 'text-gray-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
