export type Claim = {
  id: string;
  policyNo: string;
  amount: number;
  description: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Investigation';
  riskScore: number;
  riskLabel: 'Low' | 'Medium' | 'High';
  documents: {
    name: string;
    url: string;
    forgeryCheck: 'Passed' | 'Suspected' | 'Pending';
  }[];
  claimant: {
    name: string;
    avatarUrl: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  comments: {
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    timestamp: string;
  }[];
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};
