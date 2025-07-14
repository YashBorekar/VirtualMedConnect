import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Brain, AlertTriangle, Lightbulb, BookOpen, Video } from "lucide-react";
import { Link } from "wouter";

export default function SymptomChecker() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: { symptoms: string; age: string; gender: string }) => {
      const response = await apiRequest("POST", "/api/symptom-analysis", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed. Please review the results below.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your symptoms.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to use the symptom checker.",
        variant: "destructive",
      });
      return;
    }

    analyzeSymptomsMutation.mutate({ symptoms, age, gender });
  };

  const handleClearForm = () => {
    setSymptoms("");
    setAge("");
    setGender("");
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Symptom Checker</h1>
          <p className="text-lg text-gray-600">
            Describe your symptoms and get preliminary insights powered by medical AI.
          </p>
        </div>

        {/* Symptom Analysis Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Symptom Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Describe your symptoms
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="E.g., I have a headache and fever for the past 2 days, feeling tired..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="26-35">26-35</SelectItem>
                      <SelectItem value="36-45">36-45</SelectItem>
                      <SelectItem value="46-55">46-55</SelectItem>
                      <SelectItem value="56-65">56-65</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={analyzeSymptomsMutation.isPending}
                >
                  {analyzeSymptomsMutation.isPending ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
                {analysis && (
                  <Button type="button" variant="outline" onClick={handleClearForm}>
                    New Analysis
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                Preliminary Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Possible Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Possible Conditions</h3>
                {analysis.analysis?.conditions?.map((condition: any, index: number) => (
                  <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                    condition.probability >= 70 ? "border-yellow-400 bg-yellow-50" :
                    condition.probability >= 50 ? "border-blue-400 bg-blue-50" :
                    "border-gray-400 bg-gray-50"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{condition.name}</h4>
                      <Badge variant={
                        condition.probability >= 70 ? "default" :
                        condition.probability >= 50 ? "secondary" : "outline"
                      }>
                        {condition.probability}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{condition.description}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {analysis.analysis?.recommendations && (
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {analysis.analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <Alert className="border-medical-red/20 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-medical-red" />
                <AlertDescription className="text-gray-700">
                  <strong className="text-medical-red">Important Disclaimer:</strong>{" "}
                  This analysis is for informational purposes only and should not replace professional medical advice. 
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/find-doctors">
                    <Video className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Link>
                </Button>
                {isAuthenticated && (
                  <Button variant="outline" className="flex-1">
                    Save Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Card for Non-Authenticated Users */}
        {!isAuthenticated && !analysis && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Personalized Health Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Sign in to save your symptom analyses and get personalized health recommendations.
              </p>
              <Button asChild>
                <a href="/api/login">Sign In to Continue</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
