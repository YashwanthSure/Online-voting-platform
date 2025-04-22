
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WebcamCapture from "@/components/WebcamCapture";
import { Voter } from "@/types";
import { generateVoterId, registerVoter } from "@/utils/voterUtils";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  govtId: z.string().min(6, { message: "Government ID must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      govtId: "",
    },
  });

  const onSubmitForm = (data: FormValues) => {
    setFormData(data);
    setStep(2);
  };

  const handleCapture = (photoDataUrl: string) => {
    setPhotoData(photoDataUrl);
    setStep(3);
  };

  const handleRegister = () => {
    if (!formData || !photoData) {
      toast.error("Missing required information");
      return;
    }

    const voterId = generateVoterId(formData.name, formData.govtId);
    
    const newVoter: Voter = {
      id: voterId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      govtId: formData.govtId,
      photo: photoData,
      hasVoted: false,
      registeredAt: new Date().toISOString(),
    };
    
    const success = registerVoter(newVoter);
    
    if (success) {
      setGeneratedId(voterId);
      setStep(4);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-vote-primary">Voter Registration</CardTitle>
          <CardDescription>
            {step === 1 && "Step 1: Personal Information"}
            {step === 2 && "Step 2: Photo Verification"}
            {step === 3 && "Step 3: Confirm Registration"}
            {step === 4 && "Registration Complete"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="govtId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ID Number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your national ID, passport, or driver's license number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-vote-primary hover:bg-vote-secondary">
                  Continue
                </Button>
              </form>
            </Form>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="mb-2">Please take a photo for verification</p>
                <p className="text-sm text-gray-500">
                  This will be used to verify your identity when you vote
                </p>
              </div>
              
              <WebcamCapture onCapture={handleCapture} />
              
              <Button variant="outline" onClick={() => setStep(1)} className="w-full mt-4">
                Back
              </Button>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="font-medium text-lg">Review Your Information</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name:</p>
                  <p className="font-medium">{formData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <p className="font-medium">{formData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone:</p>
                  <p className="font-medium">{formData?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Government ID:</p>
                  <p className="font-medium">{formData?.govtId}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Photo:</p>
                {photoData && (
                  <img 
                    src={photoData} 
                    alt="Verification" 
                    className="mt-2 w-full max-w-[200px] mx-auto rounded"
                  />
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleRegister} 
                  className="flex-1 bg-vote-primary hover:bg-vote-secondary"
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          )}
          
          {step === 4 && (
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
              
              <h3 className="text-xl font-medium text-gray-900">Registration Successful!</h3>
              
              <div className="bg-vote-highlight p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Your Voter ID:</p>
                <p className="text-lg font-bold text-vote-primary">{generatedId}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Save this ID. You'll need it to log in and vote.
                </p>
              </div>
              
              <p className="text-sm text-gray-600">
                Thank you for registering. You can now log in with your voter ID to cast your vote.
              </p>
            </div>
          )}
        </CardContent>
        
        {step === 4 && (
          <CardFooter>
            <Button 
              onClick={handleBackToHome} 
              className="w-full bg-vote-primary hover:bg-vote-secondary"
            >
              Return to Home
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Register;
