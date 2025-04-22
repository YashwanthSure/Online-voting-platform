
export interface Voter {
  id: string;
  name: string;
  email: string;
  phone: string;
  govtId: string;
  photo: string;
  hasVoted: boolean;
  registeredAt: string;
  votedAt?: string;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  photo: string;
  votes: number;
}

export interface Admin {
  username: string;
  password: string;
}
