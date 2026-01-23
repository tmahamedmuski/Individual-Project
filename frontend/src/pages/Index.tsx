import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/ui/role-card";
import {
  Briefcase,
  Building2,
  Hammer,
  MapPin,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Service Requester",
      description:
        "I need to find workers for my tasks. Post service requests and connect with verified workers nearby.",
      icon: Building2,
      variant: "requester" as const,
      path: "/requester",
    },
    {
      title: "Service Worker",
      description:
        "I want to offer my services. Accept jobs, build your reputation, and earn from your skills.",
      icon: Wrench,
      variant: "worker" as const,
      path: "/worker",
    },
    {
      title: "Broker/Manager",
      description:
        "I manage workers and help them find jobs. Create accounts for workers and apply on their behalf.",
      icon: Users,
      variant: "broker" as const,
      path: "/broker",
    },
    {
      title: "Administrator",
      description:
        "Platform administration and oversight. Verify workers, resolve disputes, and monitor activity.",
      icon: Shield,
      variant: "admin" as const,
      path: "/admin",
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description: "Find verified workers near you with real-time GPS tracking",
    },
    {
      icon: ShieldCheck,
      title: "Verified Profiles",
      description: "All workers are verified for identity and skills",
    },
    {
      icon: Star,
      title: "Ratings & Reviews",
      description: "Make informed decisions with transparent feedback",
    },
    {
      icon: Briefcase,
      title: "Easy Job Management",
      description: "Track jobs from request to completion seamlessly",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Hammer className="h-4 w-4" />
              <span>Smart Service Platform</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
              Connect with{" "}
              <span className="text-gradient">Skilled Workers</span>
              <br />
              in Your Area
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A location-based service request system for households, universities, and
              companies. Find verified workers instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community today as a service requester, worker, or broker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Create an Account
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-8 text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-xl p-2">
                <span className="text-white font-bold">SSP</span>
              </div>
              <div>
                <p className="font-semibold">Smart Service Platform</p>
                <p className="text-sm text-sidebar-foreground/60">
                  Location-Based Service System
                </p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/60">
              © 2025 Smart Service Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
