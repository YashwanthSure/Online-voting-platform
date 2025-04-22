
import { Candidate } from "@/types";
import { candidates } from "./mockData";
import { toast } from "sonner";

// Get all candidates
export const getAllCandidates = (): Candidate[] => {
  return candidates;
};

// Register a vote for a candidate
export const voteForCandidate = (candidateId: number): boolean => {
  try {
    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
    
    if (candidateIndex === -1) {
      toast.error("Candidate not found");
      return false;
    }
    
    // Increment vote count
    candidates[candidateIndex].votes += 1;
    
    return true;
  } catch (error) {
    console.error("Error voting for candidate:", error);
    toast.error("Failed to record vote. Please try again.");
    return false;
  }
};

// Get vote results (for admin)
export const getVoteResults = (): Candidate[] => {
  return [...candidates].sort((a, b) => b.votes - a.votes);
};
