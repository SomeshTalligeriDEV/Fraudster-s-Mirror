'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Paperclip,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ClaimDetailClient } from '@/components/dashboard/claim-detail-client';
import { cn } from '@/lib/utils';
import { getFraudExplanation } from '@/ai/flows/explainable-ai-output';
import { useClaims } from '@/hooks/use-claims';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClaimDetailPage() {
  const params = useParams();
  const { getClaimById } = useClaims();
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';
  const claim = getClaimById(id);

  useEffect(() => {
    if (claim) {
      setIsLoadingExplanation(true);
      getFraudExplanation({
        claimDetails: claim.description,
        riskScore: claim.riskScore,
        riskLabel: claim.riskLabel,
        documentAnalysis: `Document forgery check: ${claim.documents.map(d => d.forgeryCheck).join(', ')}`,
        claimHistory: "No significant claim history found." // Placeholder
      }).then(result => {
        setExplanation(result.explanation);
      }).catch(err => {
        console.error("Failed to get explanation", err);
        setExplanation("Could not load AI explanation.");
      }).finally(() => {
        setIsLoadingExplanation(false);
      });
    }
  }, [claim]);

  if (!claim) {
    return (
      <div className="flex h-full items-center justify-center">
          <p>Loading claim...</p>
      </div>
    )
  }
  
  // This check prevents a flash of the notFound page before the context is hydrated
  if (!claim && id) {
     const [isReady, setIsReady] = useState(false);
     useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 500); // Wait for context
        return () => clearTimeout(timer);
    }, []);
    
    if (isReady) notFound();
    return <p>Loading claim...</p>;
  }


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
                {isLoadingExplanation ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="flex items-start gap-4 rounded-md border bg-muted/50 p-4">
                    <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <p className="text-sm">{explanation}</p>
                  </div>
                )}
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
