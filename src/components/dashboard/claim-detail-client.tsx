'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Claim } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import { useClaims } from '@/hooks/use-claims';

const StatusBadge = ({ status }: { status: Claim['status'] }) => (
  <Badge
    variant="secondary"
    className={cn(
      'text-base',
      status === 'Approved' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      status === 'Investigation' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      status === 'Rejected' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    )}
  >
    {status}
  </Badge>
);

export function ClaimDetailClient({ claim }: { claim: Claim }) {
  const { updateClaim } = useClaims();
  const [newComment, setNewComment] = useState('');

  const handleStatusChange = (status: Claim['status']) => {
    updateClaim({ ...claim, status });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const addedComment = {
        id: uuidv4(),
        author: 'Alex Doe', // mock user
        avatarUrl: 'https://placehold.co/100x100.png',
        text: newComment,
        timestamp: new Date().toISOString(),
      };
      updateClaim({ ...claim, comments: [...claim.comments, addedComment] });
      setNewComment('');
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Status & Actions</CardTitle>
          <StatusBadge status={claim.status} />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => handleStatusChange('Investigation')}>Investigate</Button>
          <Button variant="destructive" onClick={() => handleStatusChange('Rejected')}>Reject</Button>
          <Button className="col-span-2" onClick={() => handleStatusChange('Approved')}>Approve Claim</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Investigator Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {claim.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatarUrl} alt={comment.author} data-ai-hint="person" />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full rounded-md border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3">
             <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Alex Doe" data-ai-hint="person" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="w-full relative">
                <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="pr-12"
                />
                <Button size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={handleAddComment}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
