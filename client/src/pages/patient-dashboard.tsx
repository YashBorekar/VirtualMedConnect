import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AppointmentCard from "@/components/appointment-card";
import { Link } from "wouter";
import { Plus, FileText, Stethoscope, MessageSquare, Activity } from "lucide-react";
import { useEffect } from "react";

export default function PatientDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
    enabled: true, // Always load appointments for demo mode
  });

  const { data: healthRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["/api/health-records"],
    enabled: true, // Always load health records for demo mode
  });

  const joinCallMutation = useMutation({
    mutationFn: async (appointmentId: number) => {
      // Mock video call functionality
      toast({
        title: "Joining Call",
        description: "Connecting to video consultation...",
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
        description: "Failed to join call",
        variant: "destructive",
      });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: number) => {
      await apiRequest("DELETE", `/api/appointments/${appointmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
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
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date() && apt.status === "scheduled"
  );

  const recentRecords = healthRecords.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.firstName || "there"}
                  </h1>
                  <p className="text-gray-600">Manage your health and appointments</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/find-doctors">
                  <Plus className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment: any) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        userRole="patient"
                        onJoinCall={(id) => joinCallMutation.mutate(id)}
                        onCancel={(id) => cancelAppointmentMutation.mutate(id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No upcoming appointments</p>
                    <Button asChild>
                      <Link href="/find-doctors">Book Your First Appointment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Health Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Health Records</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentRecords.length > 0 ? (
                  <div className="space-y-4">
                    {recentRecords.map((record: any) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{record.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No health records yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/symptom-checker">
                    <Stethoscope className="mr-3 h-4 w-4" />
                    Check Symptoms
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-3 h-4 w-4" />
                  Refill Prescription
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Message Doctor
                </Button>
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Blood Pressure</span>
                  <span className="font-medium text-medical-green">120/80</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Heart Rate</span>
                  <span className="font-medium text-medical-green">72 bpm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">150 lbs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">BMI</span>
                  <span className="font-medium text-medical-green">22.5</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Activity className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
