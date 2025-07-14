import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Phone } from "lucide-react";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: {
    id: number;
    appointmentDate: string;
    duration: number;
    consultationType: string;
    status: string;
    reasonForVisit: string | null;
    consultationFee: string | null;
    doctor?: {
      id: number;
      specialty: string;
      user?: {
        firstName: string | null;
        lastName: string | null;
        profileImageUrl: string | null;
      };
    };
    patient?: {
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
    };
  };
  userRole?: "patient" | "doctor";
  onJoinCall?: (appointmentId: number) => void;
  onReschedule?: (appointmentId: number) => void;
  onCancel?: (appointmentId: number) => void;
}

export default function AppointmentCard({
  appointment,
  userRole = "patient",
  onJoinCall,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  const appointmentDate = new Date(appointment.appointmentDate);
  const now = new Date();
  const canJoin = appointment.status === "scheduled" && appointmentDate <= now;

  const displayUser = userRole === "patient" ? appointment.doctor : appointment.patient;
  const displayName = userRole === "patient" 
    ? `Dr. ${displayUser?.user?.firstName || displayUser?.firstName || ""} ${displayUser?.user?.lastName || displayUser?.lastName || ""}`.trim()
    : `${displayUser?.firstName || ""} ${displayUser?.lastName || ""}`.trim();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={displayUser?.user?.profileImageUrl || displayUser?.profileImageUrl || ""} 
                alt={displayName} 
              />
              <AvatarFallback>
                {displayName.split(" ").map(n => n.charAt(0)).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              {userRole === "patient" && appointment.doctor && (
                <p className="text-gray-600 text-sm">{appointment.doctor.specialty} Consultation</p>
              )}
              {appointment.reasonForVisit && (
                <p className="text-gray-600 text-sm">{appointment.reasonForVisit}</p>
              )}
              
              <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{format(appointmentDate, "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{format(appointmentDate, "h:mm a")}</span>
                </div>
                <div className="flex items-center">
                  {appointment.consultationType === "video" ? (
                    <Video className="w-4 h-4 mr-1" />
                  ) : (
                    <Phone className="w-4 h-4 mr-1" />
                  )}
                  <span className="capitalize">{appointment.consultationType}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
            
            {canJoin && onJoinCall && (
              <Button size="sm" onClick={() => onJoinCall(appointment.id)}>
                <Video className="w-4 h-4 mr-1" />
                Join Call
              </Button>
            )}
            
            {appointment.status === "scheduled" && appointmentDate > now && (
              <div className="flex space-x-1">
                {onReschedule && (
                  <Button variant="outline" size="sm" onClick={() => onReschedule(appointment.id)}>
                    Reschedule
                  </Button>
                )}
                {onCancel && (
                  <Button variant="outline" size="sm" onClick={() => onCancel(appointment.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
