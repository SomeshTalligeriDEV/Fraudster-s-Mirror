'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '@/components/file-uploader';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useClaims } from '@/hooks/use-claims';
import { assessClaimRisk } from '@/ai/flows/claim-risk-assessment';
import { detectDocumentForgery } from '@/ai/flows/document-forgery-detection';
import type { Claim } from '@/lib/types';

const formSchema = z.object({
  policyNo: z.string().regex(/^POL-\d{5,}$/, 'Invalid policy number format (e.g., POL-12345).'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  documents: z.array(z.instanceof(File)).optional(),
});

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function NewClaimForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addClaim, claims } = useClaims();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyNo: '',
      amount: 0,
      description: '',
      documents: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let forgeryCheckResults = 'No documents submitted.';
      const documentChecks: Claim['documents'] = [];

      if (values.documents && values.documents.length > 0) {
        const forgeryDetectionPromises = values.documents.map(async (doc) => {
          const documentDataUri = await fileToDataUri(doc);
          const result = await detectDocumentForgery({ documentDataUri });
          return {
            name: doc.name,
            url: '#', // In a real app, this would be a storage URL
            forgeryCheck: result.forgerySuspected ? 'Suspected' : 'Passed',
            reason: result.reason,
          };
        });
        const results = await Promise.all(forgeryDetectionPromises);
        documentChecks.push(...results.map(r => ({ name: r.name, url: r.url, forgeryCheck: r.forgeryCheck })));
        forgeryCheckResults = results.map(r => `${r.name}: ${r.forgeryCheck} (${r.reason || 'No specific reason'})`).join('\n');
      }

      const riskAssessment = await assessClaimRisk({
        claimDetails: `Policy: ${values.policyNo}, Amount: $${values.amount}, Description: ${values.description}`,
        documentResults: forgeryCheckResults,
      });

      const newClaim: Claim = {
        id: `CLM-00${claims.length + 1}`,
        policyNo: values.policyNo,
        amount: values.amount,
        description: values.description,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
        riskScore: riskAssessment.riskScore,
        riskLabel: riskAssessment.riskLabel,
        documents: documentChecks,
        claimant: { name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100.png' }, // Mock user
        location: { lat: 34.0522, lng: -118.2437 }, // Mock location
        comments: [],
      };

      addClaim(newClaim);
      
      toast({
        title: 'Claim Submitted & Analyzed',
        description: `Risk assessment complete. The claim has been added to the list.`,
        variant: 'default',
      });
      router.push('/dashboard/claims');

    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error processing your claim. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="policyNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., POL-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Incident</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide a detailed account of the incident..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={5}
                      maxSize={4 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Claim
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
