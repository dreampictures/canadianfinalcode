import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useSendMessage } from "@/hooks/use-contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

type ContactForm = z.infer<typeof insertContactMessageSchema>;

export default function Contact() {
  const { mutate: sendMessage, isPending } = useSendMessage();

  const form = useForm<ContactForm>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: { name: "", email: "", mobile: "", message: "" }
  });

  function onSubmit(data: ContactForm) {
    sendMessage(data, {
      onSuccess: () => form.reset()
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-12 bg-primary text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-white/80 max-w-2xl mx-auto px-6">We'd love to hear from you. Book an appointment or ask about our courses.</p>
      </div>

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">Contact Information</h2>
              <p className="text-foreground leading-relaxed">
                Visit our luxury salon for a transformative experience. 
                Our team of experts is ready to serve you.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Location", text: "Shop No. 2 Dharamkot Road Jogewala, Ferozepur, PB 142044 IN" },
                { icon: Phone, title: "Phone", text: "+91 90561 63862", href: "tel:+919056163862" },
                { icon: Mail, title: "Email", text: "info@canadianluxurioussalon.com", href: "mailto:info@canadianluxurioussalon.com" },
                { icon: Clock, title: "Hours", text: "Mon-Sat: 9am - 8pm, Sun: Closed" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl glass-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-full glass-button-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    {item.href ? (
                      <a href={item.href} className="text-foreground hover:text-primary transition-colors">{item.text}</a>
                    ) : (
                      <p className="text-foreground">{item.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form with Water Drop Gradient */}
          <div className="water-drop-gradient p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-primary mb-8 relative z-10">Send us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className="h-12 water-drop-input rounded-xl" 
                          data-testid="input-name"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Email <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          type="email"
                          {...field} 
                          className="h-12 water-drop-input rounded-xl" 
                          data-testid="input-email"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Mobile Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91 XXXXX XXXXX" 
                          type="tel"
                          {...field} 
                          className="h-12 water-drop-input rounded-xl" 
                          data-testid="input-mobile"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Message <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[150px] water-drop-input rounded-xl resize-none" 
                          {...field} 
                          data-testid="input-message"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-12 text-lg font-bold glass-button-primary rounded-xl disabled:opacity-50"
                  data-testid="button-send-message"
                >
                  {isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
