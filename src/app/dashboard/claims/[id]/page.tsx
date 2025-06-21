import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  MessageSquare,
  Paperclip,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ClaimDetailClient } from '@/components/dashboard/claim-detail-client';
import { mockClaims } from '@/lib/data';
import { cn } from '@/lib/utils';
import { getFraudExplanation } from '@/ai/flows/explainable-ai-output';
import { assessClaimRisk } from '@/ai/flows/claim-risk-assessment';
import { detectDocumentForgery } from '@/ai/flows/document-forgery-detection';

async function getClaimData(id: string) {
  const claim = mockClaims.find(c => c.id === id);
  if (!claim) {
    return null;
  }
  
  // These are placeholders for actual AI calls.
  // In a real app, you might only call this if the explanation isn't already stored.
  const explanation = await getFraudExplanation({
      claimDetails: claim.description,
      riskScore: claim.riskScore,
      riskLabel: claim.riskLabel,
      documentAnalysis: `Document forgery check: ${claim.documents.map(d => d.forgeryCheck).join(', ')}`,
      claimHistory: "No significant claim history found." // Placeholder
  });

  return { claim, explanation: explanation.explanation };
}

const RiskBadge = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => (
  <Badge
    className={cn(
      'text-xs font-semibold',
      level === 'Low' && 'bg-green-500/20 text-green-700 dark:text-green-300',
      level === 'Medium' && 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      level === 'High' && 'bg-red-500/20 text-red-700 dark:text-red-300'
    )}
  >
    {level} Risk
  </Badge>
);

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  const data = await getClaimData(params.id);

  if (!data) {
    notFound();
  }
  
  const { claim, explanation } = data;

  const riskColor =
    claim.riskLabel === 'High'
      ? 'hsl(var(--destructive))'
      : claim.riskLabel === 'Medium'
      ? 'hsl(var(--chart-4))'
      : 'hsl(var(--chart-2))';

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard/claims">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Claims
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Claim Details: {claim.id}
          </h1>
          <p className="text-muted-foreground">
            Policy No: {claim.policyNo}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Fraud Insight</CardTitle>
              <CardDescription>AI-powered risk assessment and analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Risk Score</span>
                  <span style={{ color: riskColor }}>{claim.riskScore}%</span>
                </div>
                <Progress value={claim.riskScore} indicatorClassName="bg-[var(--risk-color)]" style={{ '--risk-color': riskColor } as React.CSSProperties} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">AI Explanation</h4>
                <div className="flex items-start gap-4 rounded-md border bg-muted/50 p-4">
                  <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <p className="text-sm">{explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {claim.documents.map(doc => (
                  <li key={doc.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                      <a href={doc.url} className="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        {doc.name}
                      </a>
                    </div>
                    <Badge variant={doc.forgeryCheck === 'Passed' ? 'default' : 'destructive'} className={cn(doc.forgeryCheck === 'Passed' && "bg-green-500/20 text-green-700 dark:text-green-300")}>
                      {doc.forgeryCheck === 'Passed' ? <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> : <AlertCircle className="mr-1.5 h-3.5 w-3.5" />}
                      {doc.forgeryCheck}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Claim Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Claimant: <strong>{claim.claimant.name}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Amount: <strong>${claim.amount.toLocaleString()}</strong></span>
                </div>
                 <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Submitted: <strong>{format(new Date(claim.submittedAt), 'PPP')}</strong></span>
                </div>
                <Separator />
                <p className="text-muted-foreground">{claim.description}</p>
            </CardContent>
          </Card>
          <ClaimDetailClient claim={claim} />
        </div>
      </div>
    </div>
  );
}
