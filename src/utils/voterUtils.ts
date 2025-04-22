
import { Voter } from "@/types";
import { toast } from "sonner";
import { voters } from "./mockData";

// Generate a unique voter ID based on name and government ID
export const generateVoterId = (name: string, govtId: string): string => {
  const namePart = name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
  const idPart = govtId.replace(/\D/g, "").substring(0, 4);
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  
  return `${namePart}-${idPart}-${randomPart}`;
};

// Add a new voter to the system
export const registerVoter = (voter: Voter): boolean => {
  try {
    // Check if voter with same email or govt ID already exists
    const existingVoter = voters.find(
      v => v.email === voter.email || v.govtId === voter.govtId
    );
    
    if (existingVoter) {
      toast.error("A voter with this email or ID is already registered");
      return false;
    }
    
    // Add the voter to our "database"
    voters.push(voter);
    toast.success("Registration successful!");
    return true;
  } catch (error) {
    console.error("Error registering voter:", error);
    toast.error("Registration failed. Please try again.");
    return false;
  }
};

// Find a voter by their ID
export const findVoter = (voterId: string): Voter | undefined => {
  return voters.find(voter => voter.id === voterId);
};

// Record a vote for a voter
export const recordVote = (voterId: string): boolean => {
  try {
    const voterIndex = voters.findIndex(voter => voter.id === voterId);
    
    if (voterIndex === -1) {
      toast.error("Voter not found");
      return false;
    }
    
    if (voters[voterIndex].hasVoted) {
      toast.error("You have already voted");
      return false;
    }
    
    // Update voter status
    voters[voterIndex].hasVoted = true;
    voters[voterIndex].votedAt = new Date().toISOString();
    
    toast.success("Vote recorded successfully!");
    return true;
  } catch (error) {
    console.error("Error recording vote:", error);
    toast.error("Failed to record vote. Please try again.");
    return false;
  }
};

// Get all registered voters (for admin)
export const getAllVoters = (): Voter[] => {
  return voters;
};
