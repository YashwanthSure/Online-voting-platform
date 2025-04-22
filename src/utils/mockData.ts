
import { Voter, Candidate, Admin } from "@/types";

// Sample candidates
export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Jane Smith",
    party: "Progressive Party",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
    votes: 0
  },
  {
    id: 2,
    name: "John Doe",
    party: "Citizens Alliance",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=John",
    votes: 0
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    party: "Unity Coalition",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Maria",
    votes: 0
  },
  {
    id: 4,
    name: "Michael Chen",
    party: "Reform Movement",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Michael",
    votes: 0
  }
];

// Initial empty voters array
export const voters: Voter[] = [];

// Admin credentials
export const admin: Admin = {
  username: "admin",
  password: "admin123"
};
