
import React, { createContext, useContext, useState } from "react";
import { Voter } from "@/types";
import { admin } from "@/utils/mockData";
import { findVoter } from "@/utils/voterUtils";
import { toast } from "sonner";

type AuthContextType = {
  currentVoter: Voter | null;
  isAdmin: boolean;
  loginVoter: (voterId: string) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const loginVoter = (voterId: string): boolean => {
    const voter = findVoter(voterId);
    
    if (!voter) {
      toast.error("Invalid voter ID");
      return false;
    }
    
    setCurrentVoter(voter);
    setIsAdmin(false);
    return true;
  };

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === admin.username && password === admin.password) {
      setCurrentVoter(null);
      setIsAdmin(true);
      return true;
    }
    
    toast.error("Invalid admin credentials");
    return false;
  };

  const logout = () => {
    setCurrentVoter(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ currentVoter, isAdmin, loginVoter, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
