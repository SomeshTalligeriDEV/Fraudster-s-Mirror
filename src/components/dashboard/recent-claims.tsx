import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Claim } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

export function RecentClaims({ claims }: { claims: Claim[] }) {
  return (
    <div className="space-y-4">
      {claims.map(claim => (
        <div key={claim.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={claim.claimant.avatarUrl} alt={claim.claimant.name} data-ai-hint="person" />
              <AvatarFallback>{claim.claimant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{claim.claimant.name}</p>
              <p className="text-sm text-muted-foreground">
                ${claim.amount.toLocaleString()} - Risk: {claim.riskScore}%
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/dashboard/claims/${claim.id}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
