import { NewClaimForm } from '@/components/dashboard/new-claim-form';

export default function NewClaimPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Submit a New Claim</h1>
        <p className="text-muted-foreground max-w-2xl">
          Please fill out the form below with all the required details. Upload any supporting documents to help us process your claim faster.
        </p>
      </div>
      <NewClaimForm />
    </div>
  );
}
