import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  ArrowLeft, 
  Check,
  User
} from "lucide-react";
import { format, addDays, isSameDay, setHours, setMinutes } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [consultationType, setConsultationType] = useState<string>("video");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  // Fetch doctor details
  const { data: doctor, isLoading: doctorLoading } = useQuery({
    queryKey: ["/api/doctors", doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      const response = await fetch(`/api/doctors/${doctorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctor details");
      }
      return response.json();
    },
    enabled: !!doctorId,
  });

  // Fetch all doctors if no specific doctor selected
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["/api/doctors"],
    enabled: !doctorId,
  });

  // Generate available time slots (mock data - in real app would come from API)
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = format(setMinutes(setHours(new Date(), hour), minute), "h:mm a");
        // Mock availability - in real app would check doctor's schedule
        const available = Math.random() > 0.3; // 70% chance of being available
        slots.push({ time, available });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.available);

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });
      setLocation("/");
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
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !consultationType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedDoctor = doctor || doctors.find((d: any) => d.id.toString() === doctorId);
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor.",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const [time, period] = selectedTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hour24, parseInt(minutes), 0, 0);

    const appointmentData = {
      doctorId: selectedDoctor.id,
      appointmentDate: appointmentDate.toISOString(),
      consultationType,
      reasonForVisit: reasonForVisit || null,
      consultationFee: selectedDoctor.consultationFee,
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setLocation("/find-doctors");
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedDoctor = doctor || (doctorId ? doctors.find((d: any) => d.id.toString() === doctorId) : null);
  const doctorName = selectedDoctor 
    ? `Dr. ${selectedDoctor.user?.firstName || ""} ${selectedDoctor.user?.lastName || ""}`.trim()
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                  currentStep >= 1 ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className={`text-sm font-medium ${currentStep >= 1 ? "text-gray-900" : "text-gray-600"}`}>
                  Select Date & Time
                </span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                  currentStep >= 2 ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-600"}`}>
                  Consultation Details
                </span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                  currentStep >= 3 ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  3
                </div>
                <span className={`text-sm font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-600"}`}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Doctor Selection/Info */}
            {!doctorId && currentStep === 1 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Select a Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  {doctorsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {doctors.map((doc: any) => (
                        <button
                          key={doc.id}
                          onClick={() => setLocation(`/book-appointment/${doc.id}`)}
                          className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                          <div className="flex items-center">
                            <Avatar className="w-12 h-12 mr-4">
                              <AvatarImage src={doc.user?.profileImageUrl || ""} />
                              <AvatarFallback>
                                {doc.user?.firstName?.charAt(0)}{doc.user?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Dr. {doc.user?.firstName} {doc.user?.lastName}
                              </h3>
                              <p className="text-gray-600">{doc.specialty}</p>
                              <p className="text-sm text-gray-500">${doc.consultationFee}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedDoctor && (
              <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src={selectedDoctor.user?.profileImageUrl || ""} alt={doctorName} />
                  <AvatarFallback>
                    {selectedDoctor.user?.firstName?.charAt(0)}{selectedDoctor.user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doctorName}</h3>
                  <p className="text-primary font-medium">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-600">Consultation Fee: ${selectedDoctor.consultationFee}</p>
                </div>
              </div>
            )}

            {/* Step 1: Date & Time Selection */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h4>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Times</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`w-full p-3 border rounded-lg text-left transition-colors ${
                            selectedTime === slot.time
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 hover:border-primary hover:bg-primary/5"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No available time slots for this date
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Consultation Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Consultation Type</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setConsultationType("video")}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        consultationType === "video"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Video className={`mr-2 h-5 w-5 ${consultationType === "video" ? "text-primary" : "text-gray-500"}`} />
                        <span className="font-semibold text-gray-900">Video Consultation</span>
                      </div>
                      <p className="text-sm text-gray-600">Face-to-face video call with the doctor</p>
                    </button>
                    
                    <button
                      onClick={() => setConsultationType("audio")}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        consultationType === "audio"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Phone className={`mr-2 h-5 w-5 ${consultationType === "audio" ? "text-primary" : "text-gray-500"}`} />
                        <span className="font-semibold text-gray-900">Audio Call</span>
                      </div>
                      <p className="text-sm text-gray-600">Voice-only consultation call</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Reason for Visit
                  </label>
                  <Textarea
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder="Please describe your symptoms or reason for consultation..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Appointment Summary</h4>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium">{doctorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium">{selectedDoctor?.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{format(selectedDate, "MMMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultation Type</span>
                    <div className="flex items-center">
                      {consultationType === "video" ? (
                        <Video className="h-4 w-4 mr-1" />
                      ) : (
                        <Phone className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium capitalize">{consultationType}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium text-lg">${selectedDoctor?.consultationFee}</span>
                  </div>
                  {reasonForVisit && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-gray-600 block mb-2">Reason for Visit</span>
                      <p className="text-sm text-gray-900">{reasonForVisit}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext} 
                  className="flex-1"
                  disabled={!selectedDoctor || (currentStep === 1 && (!selectedDate || !selectedTime))}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={bookAppointmentMutation.isPending}
                >
                  {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Appointment"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
