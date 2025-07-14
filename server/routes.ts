import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertDoctorSchema, 
  insertAppointmentSchema, 
  insertHealthRecordSchema, 
  insertSymptomAnalysisSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);

  // Initialize demo data (create demo user if it doesn't exist)
  app.post('/api/init-demo', async (req: any, res) => {
    try {
      // Check if demo user already exists
      const existingUser = await storage.getUser('demo_patient_001');
      if (!existingUser) {
        // Create demo patient user
        await storage.upsertUser({
          id: 'demo_patient_001',
          email: 'demo.patient@mediconnect.com',
          firstName: 'Demo',
          lastName: 'Patient',
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
          role: 'patient'
        });
      }
      res.json({ message: 'Demo data initialized' });
    } catch (error) {
      console.error("Error initializing demo data:", error);
      res.status(500).json({ message: "Failed to initialize demo data" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For demo mode: return appropriate demo user based on route
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        // Check if this is for doctor dashboard (you can also use query params)
        const referer = req.get('Referer') || '';
        const isDoctorRoute = referer.includes('/doctor-dashboard');
        
        const demoUserId = isDoctorRoute ? 'demo_doctor_001' : 'demo_patient_001';
        const demoUser = await storage.getUser(demoUserId);
        
        // If demo user is a doctor, include doctor profile
        if (demoUser?.role === "doctor") {
          const doctorProfile = await storage.getDoctorProfile(demoUserId);
          return res.json({ ...demoUser, doctorProfile });
        }
        
        return res.json(demoUser);
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If user is a doctor, include doctor profile
      if (user.role === "doctor") {
        const doctorProfile = await storage.getDoctorProfile(userId);
        return res.json({ ...user, doctorProfile });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!role || !["patient", "doctor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        role,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Doctor routes
  app.post('/api/doctors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "doctor") {
        return res.status(403).json({ message: "Only doctors can create doctor profiles" });
      }
      
      const validatedData = insertDoctorSchema.parse({
        ...req.body,
        userId,
      });
      
      const doctor = await storage.createDoctorProfile(validatedData);
      res.status(201).json(doctor);
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create doctor profile" });
    }
  });

  app.get('/api/doctors', async (req, res) => {
    try {
      const { specialty, availability } = req.query;
      const doctors = await storage.searchDoctors(
        specialty as string,
        availability as string
      );
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctorId = parseInt(req.params.id);
      const doctor = await storage.getDoctorById(doctorId);
      
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.json(doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  app.patch('/api/doctors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const doctorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const doctor = await storage.getDoctorById(doctorId);
      if (!doctor || doctor.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updates = insertDoctorSchema.partial().parse(req.body);
      const updatedDoctor = await storage.updateDoctorProfile(doctorId, updates);
      res.json(updatedDoctor);
    } catch (error) {
      console.error("Error updating doctor:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update doctor" });
    }
  });

  // Appointment routes
  app.post('/api/appointments', async (req: any, res) => {
    try {
      // For demo: use a demo patient ID if not authenticated
      let patientId = 'demo_patient_001';
      if (req.isAuthenticated() && req.user?.claims?.sub) {
        patientId = req.user.claims.sub;
      }
      
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        patientId,
      });
      
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.get('/api/appointments', async (req: any, res) => {
    try {
      // For demo: determine user based on route or authentication
      let userId = 'demo_patient_001';
      
      if (req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      } else {
        // Check if this is for doctor dashboard
        const referer = req.get('Referer') || '';
        const isDoctorRoute = referer.includes('/doctor-dashboard');
        if (isDoctorRoute) {
          userId = 'demo_doctor_001';
        }
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let appointments;
      if (user.role === "doctor") {
        const doctorProfile = await storage.getDoctorProfile(userId);
        if (!doctorProfile) {
          return res.status(404).json({ message: "Doctor profile not found" });
        }
        appointments = await storage.getAppointmentsByDoctor(doctorProfile.id);
      } else {
        appointments = await storage.getAppointmentsByPatient(userId);
      }
      
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointmentById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.patch('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const appointment = await storage.getAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Check if user is authorized to update this appointment
      const user = await storage.getUser(userId);
      let authorized = false;
      
      if (user?.role === "patient" && appointment.patientId === userId) {
        authorized = true;
      } else if (user?.role === "doctor") {
        const doctorProfile = await storage.getDoctorProfile(userId);
        if (doctorProfile && appointment.doctorId === doctorProfile.id) {
          authorized = true;
        }
      }
      
      if (!authorized) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updates = insertAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateAppointment(appointmentId, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const appointment = await storage.getAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Check if user is authorized to cancel this appointment
      if (appointment.patientId !== userId) {
        const user = await storage.getUser(userId);
        if (user?.role === "doctor") {
          const doctorProfile = await storage.getDoctorProfile(userId);
          if (!doctorProfile || appointment.doctorId !== doctorProfile.id) {
            return res.status(403).json({ message: "Unauthorized" });
          }
        } else {
          return res.status(403).json({ message: "Unauthorized" });
        }
      }
      
      await storage.cancelAppointment(appointmentId);
      res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ message: "Failed to cancel appointment" });
    }
  });

  // Health record routes
  app.post('/api/health-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertHealthRecordSchema.parse(req.body);
      
      // Ensure user can only create records for themselves (if patient) or their patients (if doctor)
      const user = await storage.getUser(userId);
      if (user?.role === "patient" && validatedData.patientId !== userId) {
        return res.status(403).json({ message: "Patients can only create their own health records" });
      }
      
      const record = await storage.createHealthRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating health record:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create health record" });
    }
  });

  app.get('/api/health-records', async (req: any, res) => {
    try {
      // For demo: use demo patient ID if not authenticated
      let userId = 'demo_patient_001';
      if (req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      const records = await storage.getHealthRecordsByPatient(userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching health records:", error);
      res.status(500).json({ message: "Failed to fetch health records" });
    }
  });

  // Symptom analysis routes
  app.post('/api/symptom-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const patientId = req.user.claims.sub;
      const { symptoms, age, gender } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ message: "Symptoms are required" });
      }
      
      // Mock AI analysis - in production, this would call an actual AI service
      const mockAnalysis = {
        conditions: [
          {
            name: "Viral Upper Respiratory Infection",
            probability: 85,
            description: "Common symptoms include headache, fever, and fatigue. Usually resolves within 7-10 days."
          },
          {
            name: "Seasonal Allergies",
            probability: 45,
            description: "May be environmental allergies if symptoms persist or worsen outdoors."
          }
        ],
        recommendations: [
          "Rest and stay hydrated",
          "Monitor temperature regularly",
          "Consider over-the-counter pain relievers",
          "Consult a doctor if symptoms worsen or persist beyond 7 days"
        ]
      };
      
      const validatedData = insertSymptomAnalysisSchema.parse({
        patientId,
        symptoms,
        age,
        gender,
        analysis: mockAnalysis,
        recommendations: mockAnalysis.recommendations.join("; "),
      });
      
      const analysis = await storage.createSymptomAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating symptom analysis:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to analyze symptoms" });
    }
  });

  app.get('/api/symptom-analyses', isAuthenticated, async (req: any, res) => {
    try {
      const patientId = req.user.claims.sub;
      const analyses = await storage.getSymptomAnalysesByPatient(patientId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching symptom analyses:", error);
      res.status(500).json({ message: "Failed to fetch symptom analyses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
