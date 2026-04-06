import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, Clock, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="pt-32 pb-16 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/salon/interior-header.png')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 px-6">
          <h1 className="font-serif text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Founded in 2010, Canadian Luxurious Salon has been at the forefront of luxury beauty and education.
          </p>
        </div>
      </div>

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-24">
        
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SectionHeader title="Redefining Beauty" centered={false} />
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Canadian Luxurious Salon, we believe that beauty is an art form. Our mission is to provide 
              an oasis of calm where you can escape the daily grind and emerge feeling refreshed 
              and confident.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We are not just a salon; we are a training academy dedicated to nurturing the 
              next generation of beauty professionals with world-class standards.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="/images/salon/interior-2.png" className="rounded-2xl shadow-lg mt-8" alt="Salon Interior" />
             <img src="/images/staff/makeup-artist.png" className="rounded-2xl shadow-lg" alt="Makeup Artist" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, count: "5000+", label: "Happy Clients" },
            { icon: Award, count: "500+", label: "Students Certified" },
            { icon: Clock, count: "14", label: "Years of Excellence" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm text-center border border-border hover:border-secondary transition-colors">
              <stat.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.count}</h3>
              <p className="text-muted-foreground uppercase tracking-wide text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center">
          <SectionHeader title="Meet Our Experts" subtitle="The talented hands behind our success." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { name: "Sarah Jenkins", role: "Master Stylist", img: "/images/staff/sarah.png" },
              { name: "David Chen", role: "Senior Colorist", img: "/images/staff/david.png" },
              { name: "Prabh Sandhu", role: "Head of Academy", img: "/images/staff/elena.png" },
            ].map((member, idx) => (
              <div key={idx} className="group">
                <div className="overflow-hidden rounded-xl mb-4 shadow-lg">
                  <img src={member.img} alt={member.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">{member.name}</h3>
                <p className="text-secondary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
