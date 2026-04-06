import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { Check, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

const services = [
  {
    category: "Hair Care",
    items: [
      { name: "Signature Haircut", price: "₹500+" },
      { name: "Balayage & Coloring", price: "₹2,500+" },
      { name: "Keratin Treatment", price: "₹3,500+" },
      { name: "Hair Spa", price: "₹800+" },
    ]
  },
  {
    category: "Skin & Beauty",
    items: [
      { name: "Classic Facial", price: "₹1,200+" },
      { name: "Bridal Makeup", price: "₹8,000+" },
      { name: "HydraFacial", price: "₹2,500+" },
      { name: "Waxing (Full Body)", price: "₹1,500+" },
    ]
  },
  {
    category: "Nails",
    items: [
      { name: "Gel Manicure", price: "₹600+" },
      { name: "Classic Pedicure", price: "₹500+" },
      { name: "Nail Art", price: "₹300+" },
      { name: "Acrylic Extensions", price: "₹1,200+" },
    ]
  }
];

const courses = [
  {
    title: "Professional Makeup Artist",
    duration: "3 Months",
    price: "₹35,000",
    features: ["Basic to Advanced Techniques", "Bridal Makeup", "Portfolio Building", "Certification"]
  },
  {
    title: "Hair Styling Masterclass",
    duration: "2 Months",
    price: "₹25,000",
    features: ["Cutting Techniques", "Color Theory", "Chemical Treatments", "Certification"]
  },
  {
    title: "Complete Cosmetology",
    duration: "6 Months",
    price: "₹75,000",
    features: ["Hair, Skin & Nails", "Salon Management", "Client Handling", "Internship"]
  }
];

export default function Services() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleEnroll = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
    const enrollSection = document.getElementById('enroll-section');
    if (enrollSection) {
      enrollSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-12 bg-primary text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Our Services & Courses</h1>
        <p className="text-white/80 max-w-2xl mx-auto px-6">Explore our premium beauty treatments and professional certification programs.</p>
      </div>

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Services Grid - Redesigned with glass effect */}
          <SectionHeader title="Salon Services" centered className="mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {services.map((category, idx) => (
              <div key={idx} className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-primary/10 px-6 py-4 border-b border-white/20">
                  <h3 className="font-serif text-2xl font-bold text-primary">{category.category}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-0">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-center py-4 border-b border-border/30 last:border-b-0">
                        <span className="text-foreground font-semibold">{item.name}</span>
                        <span className="glass-button-secondary px-4 py-1.5 rounded-full text-sm font-bold">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Courses Grid */}
          <SectionHeader title="Professional Courses" subtitle="Start your career in the beauty industry with our certified programs." centered className="mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {courses.map((course, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-secondary/20 transform translate-x-2 translate-y-2 rounded-2xl group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                <div className="relative glass-card rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="glass-button-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Course</span>
                    <span className="font-bold text-primary text-2xl">{course.price}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-primary mb-2">{course.title}</h3>
                  <p className="text-muted-foreground mb-6 text-sm font-medium">{course.duration}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground font-medium">
                        <Check className="w-4 h-4 text-primary mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleEnroll(course.title)}
                    className="w-full py-3 glass-button-secondary font-bold rounded-lg"
                    data-testid={`button-enroll-${idx}`}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enrollment Section */}
          <div id="enroll-section" className="scroll-mt-32">
            <div className="glass-card bg-gradient-to-br from-primary/95 to-primary/85 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  {selectedCourse ? `Enroll in ${selectedCourse}` : "Ready to Start Your Journey?"}
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  {selectedCourse 
                    ? "Contact us now to secure your spot and begin your professional beauty career."
                    : "Choose a course above and take the first step towards your beauty career."
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="glass-button px-8 py-3 rounded-xl font-bold text-primary flex items-center justify-center gap-2"
                    data-testid="button-contact-us"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Us
                  </button>
                  <button 
                    onClick={() => window.open('tel:+919056163862', '_self')}
                    className="glass-button px-8 py-3 rounded-xl font-bold text-primary flex items-center justify-center gap-2"
                    data-testid="button-call-now"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                </div>

                {selectedCourse && (
                  <p className="mt-6 text-white/70 text-sm">
                    Selected course: <span className="font-bold text-white">{selectedCourse}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
