import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, GraduationCap, Building2, Clock, Video } from "lucide-react";
import { Link } from "wouter";

interface DoctorCardProps {
  doctor: {
    id: number;
    userId: string;
    specialty: string;
    education: string | null;
    hospital: string | null;
    experience: number | null;
    consultationFee: string | null;
    rating: string | null;
    reviewCount: number;
    isVerified: boolean;
    user?: {
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
    };
  };
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const fullName = `Dr. ${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim();
  const rating = doctor.rating ? parseFloat(doctor.rating) : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src={doctor.user?.profileImageUrl || ""} alt={fullName} />
            <AvatarFallback className="text-lg">
              {doctor.user?.firstName?.charAt(0) || "D"}
              {doctor.user?.lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
            <Badge variant="secondary" className="text-primary">
              {doctor.specialty}
            </Badge>
            
            {rating > 0 && (
              <div className="flex items-center justify-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} ({doctor.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          {doctor.education && (
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{doctor.education}</span>
            </div>
          )}
          {doctor.hospital && (
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
          )}
          {doctor.experience && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{doctor.experience} years experience</span>
            </div>
          )}
        </div>

        {doctor.consultationFee && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Consultation Fee</span>
            <span className="text-lg font-bold text-gray-900">
              ${doctor.consultationFee}
            </span>
          </div>
        )}

        <Button asChild className="w-full">
          <Link href={`/book-appointment/${doctor.id}`}>
            <Video className="w-4 h-4 mr-2" />
            Book Appointment
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
