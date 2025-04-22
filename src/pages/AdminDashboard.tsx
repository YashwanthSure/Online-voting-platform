
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getAllVoters } from "@/utils/voterUtils";
import { getVoteResults } from "@/utils/candidateUtils";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS = ["#4F46E5", "#8B5CF6", "#2DD4BF", "#F59E0B", "#EF4444"];

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("results");
  
  const voters = getAllVoters();
  const results = getVoteResults();
  
  // For charts
  const pieData = results.map((candidate) => ({
    name: candidate.name,
    value: candidate.votes,
  }));
  
  const barData = results.map((candidate) => ({
    name: candidate.name,
    votes: candidate.votes,
  }));
  
  // Stats
  const totalVoters = voters.length;
  const totalVotes = voters.filter(voter => voter.hasVoted).length;
  const participationRate = totalVoters > 0 ? (totalVotes / totalVoters * 100).toFixed(1) : "0";

  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-vote-background">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-vote-primary">Election Admin Dashboard</h1>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Registered</CardTitle>
              <CardDescription>Registered voters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVoters}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Votes</CardTitle>
              <CardDescription>Votes cast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVotes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participation</CardTitle>
              <CardDescription>Voter turnout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participationRate}%</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="voters">Registered Voters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vote Distribution</CardTitle>
                  <CardDescription>Breakdown of votes by candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Vote Count</CardTitle>
                  <CardDescription>Total votes per candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Detailed Results</CardTitle>
                  <CardDescription>Candidates ranked by votes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">Rank</th>
                          <th className="p-2">Candidate</th>
                          <th className="p-2">Party</th>
                          <th className="p-2">Votes</th>
                          <th className="p-2">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((candidate, index) => (
                          <tr key={candidate.id} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 flex items-center">
                              <img 
                                src={candidate.photo} 
                                alt={candidate.name} 
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              {candidate.name}
                            </td>
                            <td className="p-2">{candidate.party}</td>
                            <td className="p-2">{candidate.votes}</td>
                            <td className="p-2">
                              {totalVotes > 0 
                                ? `${((candidate.votes / totalVotes) * 100).toFixed(1)}%` 
                                : "0%"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="voters">
            <Card>
              <CardHeader>
                <CardTitle>Registered Voters</CardTitle>
                <CardDescription>List of all registered voters and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {voters.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No registered voters yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">ID</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Registration Date</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Photo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voters.map((voter) => (
                          <tr key={voter.id} className="border-b">
                            <td className="p-2">{voter.id}</td>
                            <td className="p-2">{voter.name}</td>
                            <td className="p-2">{voter.email}</td>
                            <td className="p-2">
                              {new Date(voter.registeredAt).toLocaleString()}
                            </td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                voter.hasVoted 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {voter.hasVoted ? "Voted" : "Not Voted"}
                              </span>
                            </td>
                            <td className="p-2">
                              <img 
                                src={voter.photo} 
                                alt={voter.name} 
                                className="h-10 w-10 rounded-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
