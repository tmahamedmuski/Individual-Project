import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Hammer, 
  Paintbrush, 
  Truck,
  UtensilsCrossed,
  Users,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Pipe repairs, installations, and maintenance",
    workers: 45,
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, repairs, and electrical installations",
    workers: 38,
    color: "bg-yellow-500/10 text-yellow-600"
  },
  {
    icon: Sparkles,
    title: "Cleaning",
    description: "Home and office cleaning services",
    workers: 72,
    color: "bg-cyan-500/10 text-cyan-600"
  },
  {
    icon: Hammer,
    title: "Carpentry",
    description: "Furniture making and woodwork",
    workers: 29,
    color: "bg-amber-500/10 text-amber-600"
  },
  {
    icon: Paintbrush,
    title: "Painting",
    description: "Interior and exterior painting",
    workers: 34,
    color: "bg-pink-500/10 text-pink-600"
  },
  {
    icon: Truck,
    title: "Moving",
    description: "Relocation and heavy lifting",
    workers: 56,
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description: "Event catering and food services",
    workers: 41,
    color: "bg-red-500/10 text-red-600"
  },
  {
    icon: Users,
    title: "Event Staff",
    description: "Temporary staff for events",
    workers: 89,
    color: "bg-purple-500/10 text-purple-600"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Help for Any Task
          </h2>
          <p className="text-muted-foreground text-lg">
            From household repairs to event staffing, connect with verified professionals for all your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to="/services"
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">
                  {service.workers} workers
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
