import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-workers.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Location-Based Service Matching</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Find Trusted
              <span className="block text-gradient">Skilled Workers</span>
              Near You
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Connect with verified professionals for all your household, business, and institutional service needs across Sri Lanka.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <Button variant="hero" size="xl" asChild>
                <Link to="/services">
                  Find Workers
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Verified Workers</p>
                  <p className="text-xs text-muted-foreground">ID & Skills Checked</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Rated & Reviewed</p>
                  <p className="text-xs text-muted-foreground">5000+ Reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Quick Response</p>
                  <p className="text-xs text-muted-foreground">Within 30 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Skilled workers ready to help"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">324</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">Active Workers</p>
                    <p className="text-sm text-muted-foreground">Ready to help now</p>
                  </div>
                </div>
              </div>

              {/* Another Floating Card */}
              <div className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-xl border border-border animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 border-2 border-white" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 translate-x-8 translate-y-8">
              <div className="w-full h-full rounded-3xl bg-accent/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
