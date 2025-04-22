
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-vote-primary mb-2">
            Online Voting Platform
          </h1>
          <p className="text-xl text-gray-600">Secure Online Voting Portal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vote-primary">Register to Vote</CardTitle>
              <CardDescription>New voters register here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Complete your voter registration by providing your details and taking a photo for verification.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/register" className="w-full">
                <Button className="w-full bg-vote-primary hover:bg-vote-secondary">
                  Register Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vote-primary">Voter Login</CardTitle>
              <CardDescription>Cast your vote securely</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Already registered? Log in with your voter ID to access the voting area.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-vote-accent hover:bg-vote-primary">
                  Login to Vote
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vote-primary">Admin Access</CardTitle>
              <CardDescription>Election management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Election administrators can view real-time results and manage voter records.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin" className="w-full">
                <Button className="w-full" variant="outline">
                  Admin Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Online Voting Platform - Secure Online Voting Platform</p>
          <p className="mt-1">For demonstration purposes only</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
