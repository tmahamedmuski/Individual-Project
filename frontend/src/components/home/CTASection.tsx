import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, UserPlus } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Service Requesters */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl bg-card border border-border animate-fade-up">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-accent opacity-10 blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Need Help with Tasks?
              </h3>
              <p className="text-muted-foreground mb-6">
                Post your service request and get matched with verified workers in your area. Quick, easy, and reliable.
              </p>
              <Button variant="accent" size="lg" asChild>
                <Link to="/register">
                  Post a Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Workers */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl gradient-primary animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Earn More?
              </h3>
              <p className="text-white/80 mb-6">
                Join our platform as a verified worker. Get access to jobs in your area and build your reputation.
              </p>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/register">
                  Join as Worker
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
