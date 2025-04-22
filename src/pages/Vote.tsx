
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCandidates, voteForCandidate } from "@/utils/candidateUtils";
import { recordVote } from "@/utils/voterUtils";
import WebcamCapture from "@/components/WebcamCapture";

const Vote: React.FC = () => {
  const { currentVoter, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [verificationPhoto, setVerificationPhoto] = useState<string | null>(null);
  
  const candidates = getAllCandidates();

  React.useEffect(() => {
    if (!currentVoter) {
      navigate("/login");
      return;
    }
    
    if (currentVoter.hasVoted) {
      toast.error("You have already voted");
      navigate("/");
    }
  }, [currentVoter, navigate]);

  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };

  const handleContinue = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }
    
    setStep(2);
  };

  const handlePhotoCapture = (photoData: string) => {
    setVerificationPhoto(photoData);
  };

  const handleCastVote = () => {
    if (!currentVoter || !selectedCandidate || !verificationPhoto) {
      toast.error("Missing required information");
      return;
    }
    
    // Record vote for candidate
    const candidateSuccess = voteForCandidate(selectedCandidate);
    
    // Record that voter has voted
    const voterSuccess = recordVote(currentVoter.id);
    
    if (candidateSuccess && voterSuccess) {
      setStep(3);
    }
  };

  const handleFinish = () => {
    logout();
    navigate("/");
  };

  if (!currentVoter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-vote-primary">
            {step === 1 && "Select Your Candidate"}
            {step === 2 && "Verify Your Identity"}
            {step === 3 && "Vote Confirmation"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose one candidate to cast your vote"}
            {step === 2 && "Take a photo to verify your identity"}
            {step === 3 && "Your vote has been recorded"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">Voter: {currentVoter.name}</p>
                <p className="text-xs text-gray-500">ID: {currentVoter.id}</p>
              </div>
              
              <div className="grid gap-4">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedCandidate === candidate.id 
                        ? "border-vote-primary bg-vote-highlight" 
                        : "hover:border-vote-primary"
                    }`}
                    onClick={() => handleSelectCandidate(candidate.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name} 
                          className="h-16 w-16 rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-sm text-gray-500">{candidate.party}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="mb-2">Please take a photo for verification</p>
                <p className="text-sm text-gray-500">
                  This will be compared with your registration photo to verify your identity
                </p>
              </div>
              
              <WebcamCapture onCapture={handlePhotoCapture} />
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="py-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-gray-900">Vote Successfully Cast!</h3>
              
              <p className="text-sm text-gray-600">
                Thank you for participating in this election. Your vote has been recorded securely.
              </p>
              
              <div className="p-4 bg-vote-highlight rounded-lg">
                <p className="text-sm text-gray-600">Your vote has been recorded at:</p>
                <p className="text-lg font-medium">{new Date().toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === 1 && (
            <>
              <Button variant="ghost" onClick={logout}>
                Cancel
              </Button>
              <Button 
                onClick={handleContinue} 
                className="bg-vote-primary hover:bg-vote-secondary"
                disabled={!selectedCandidate}
              >
                Continue
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleCastVote} 
                className="bg-vote-primary hover:bg-vote-secondary"
                disabled={!verificationPhoto}
              >
                Cast Vote
              </Button>
            </>
          )}
          
          {step === 3 && (
            <Button 
              onClick={handleFinish} 
              className="w-full bg-vote-primary hover:bg-vote-secondary"
            >
              Finish
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Vote;
