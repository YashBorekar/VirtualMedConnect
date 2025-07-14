import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import PatientDashboard from "@/pages/patient-dashboard";
import DoctorDashboard from "@/pages/doctor-dashboard";
import FindDoctors from "@/pages/find-doctors";
import SymptomChecker from "@/pages/symptom-checker";
import BookAppointment from "@/pages/book-appointment";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={
        isAuthenticated 
          ? (user?.role === "doctor" ? DoctorDashboard : PatientDashboard)
          : Auth
      } />
      <Route path="/auth" component={Auth} />
      <Route path="/patient-dashboard" component={PatientDashboard} />
      <Route path="/doctor-dashboard" component={DoctorDashboard} />
      <Route path="/find-doctors" component={FindDoctors} />
      <Route path="/symptom-checker" component={SymptomChecker} />
      <Route path="/book-appointment/:doctorId" component={BookAppointment} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
