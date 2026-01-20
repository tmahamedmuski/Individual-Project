import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kumara Perera",
    role: "Homeowner, Colombo",
    content: "Found a reliable plumber within 30 minutes! The verification system gave me confidence in hiring.",
    rating: 5,
    avatar: "KP"
  },
  {
    name: "Nimal Fernando",
    role: "University Administrator",
    content: "We use Smart Service for all our maintenance needs. The bulk request feature saves us so much time.",
    rating: 5,
    avatar: "NF"
  },
  {
    name: "Samantha Silva",
    role: "Event Coordinator",
    content: "Excellent platform for finding event staff. The workers are professional and punctual.",
    rating: 5,
    avatar: "SS"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by households, universities, and companies across Sri Lanka.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
