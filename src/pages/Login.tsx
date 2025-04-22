
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  voterId: z.string().min(1, { message: "Voter ID is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login: React.FC = () => {
  const { loginVoter } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voterId: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const success = loginVoter(data.voterId);
    
    if (success) {
      navigate("/vote");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-vote-primary">Voter Login</CardTitle>
          <CardDescription>Enter your voter ID to access the voting area</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="voterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voter ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JOH-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-vote-primary hover:bg-vote-secondary">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex-col space-y-2">
          <div className="text-sm text-gray-500 text-center">
            <p>Don't have a voter ID?</p>
          </div>
          <Button onClick={() => navigate("/register")} variant="outline" className="w-full">
            Register as a Voter
          </Button>
          <Button onClick={() => navigate("/")} variant="ghost" className="w-full">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
