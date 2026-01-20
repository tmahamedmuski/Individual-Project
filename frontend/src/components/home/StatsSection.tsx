const stats = [
  { value: "1,247", label: "Registered Users", suffix: "+" },
  { value: "324", label: "Verified Workers", suffix: "" },
  { value: "5,000", label: "Jobs Completed", suffix: "+" },
  { value: "4.9", label: "Average Rating", suffix: "/5" },
];

const StatsSection = () => {
  return (
    <section className="py-16 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
                <span className="text-white/70">{stat.suffix}</span>
              </div>
              <p className="text-white/80 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
