import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { Video, Stethoscope, Shield, UserCheck, Clock, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Quality Healthcare
                <span className="text-primary"> At Your Fingertips</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Connect with certified doctors through secure video consultations. Get AI-powered symptom analysis and manage your health records all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/find-doctors">
                    <Video className="mr-2 h-5 w-5" />
                    Find Doctors
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                  <Link href="/symptom-checker">
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Check Symptoms
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-medical-green mr-2" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-medical-green mr-2" />
                  <span>Certified Doctors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-medical-green mr-2" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Healthcare professional in modern medical office" 
                className="rounded-xl shadow-xl w-full h-auto" 
              />
              
              {/* Floating stats card */}
              <Card className="absolute -bottom-6 -left-6 bg-white shadow-lg border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">15K+</div>
                      <div className="text-sm text-gray-600">Consultations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-medical-green">500+</div>
                      <div className="text-sm text-gray-600">Doctors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediConnect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience healthcare like never before with our cutting-edge platform designed for your convenience and peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Consultations</h3>
                <p className="text-gray-600">
                  Connect face-to-face with certified doctors from the comfort of your home through secure video calls.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Symptom Checker</h3>
                <p className="text-gray-600">
                  Get preliminary insights about your symptoms using our advanced AI-powered analysis system.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Records</h3>
                <p className="text-gray-600">
                  Your health data is encrypted and stored securely, ensuring complete privacy and HIPAA compliance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust MediConnect for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
              <a href="/api/login">Get Started Today</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary">
              <Link href="/find-doctors">Browse Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
