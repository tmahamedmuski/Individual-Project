import { Search, UserCheck, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Post Your Request",
    description: "Describe the service you need, set your location and preferred timing."
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Get Matched",
    description: "Our system matches you with verified workers near your location."
  },
  {
    icon: Calendar,
    step: "03",
    title: "Confirm & Schedule",
    description: "Review worker profiles, ratings, and confirm your booking."
  },
  {
    icon: Star,
    step: "04",
    title: "Rate & Review",
    description: "After completion, rate the service to help others find great workers."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple Steps to Get Help
          </h2>
          <p className="text-muted-foreground text-lg">
            Getting the help you need is quick and easy with our streamlined process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
              )}
              
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
