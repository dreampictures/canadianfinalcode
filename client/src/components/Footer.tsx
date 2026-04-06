import { Link } from "wouter";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { SiX } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <img src="/logo-full.png" alt="Canadian Luxurious Salon" className="h-12 w-auto brightness-0 invert" />
          <p className="text-primary-foreground/70 leading-relaxed">
            Where beauty meets luxury. We provide premium salon services and professional certification courses for aspiring beauty experts.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-secondary hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-secondary hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-secondary hover:text-primary transition-colors">
              <SiX className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-serif text-xl font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Our Work", href: "/gallery" },
              { label: "Verify Certificate", href: "/verify" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-serif text-xl font-semibold text-white">Contact Us</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-primary-foreground/70">
              <MapPin className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
              <span>Shop No. 2 Dharamkot Road Jogewala,<br />Ferozepur, PB 142044 IN</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Phone className="w-5 h-5 text-secondary shrink-0" />
              <a href="tel:+919056163862" className="hover:text-secondary transition-colors">+91 90561 63862</a>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <a href="mailto:info@canadianluxurioussalon.com" className="hover:text-secondary transition-colors">info@canadianluxurioussalon.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40">
        <span>© {new Date().getFullYear()} Canadian Luxurious Salon. All rights reserved.</span>
        <a 
          href="https://www.thedreampictures.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-secondary transition-colors"
        >
          Managed By Dream Pictures
        </a>
      </div>
    </footer>
  );
}
