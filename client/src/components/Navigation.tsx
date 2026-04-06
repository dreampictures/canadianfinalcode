import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Our Work" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/verify", label: "Verify Certificate" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full glass-header z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" data-testid="link-logo">
          <img src="/logo-full.png" alt="Canadian Luxurious Salon" className="h-12 w-auto" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-colors",
                location === link.href 
                  ? "text-primary border-b-2 border-secondary pb-1" 
                  : "text-foreground/80 hover:text-primary"
              )}
              data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
             <div className="flex items-center gap-4 border-l border-primary/20 pl-4">
                <Link 
                  href="/admin" 
                  className="text-sm font-bold text-primary hover:text-secondary"
                  data-testid="link-dashboard"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => logout()}
                  className="glass-button-primary px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg"
                  data-testid="button-logout"
                >
                  Logout
                </button>
             </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden glass-button p-2 rounded-lg text-primary" 
          onClick={toggleMenu}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-card m-4 rounded-xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top-5">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-serif font-semibold py-2 px-4 rounded-lg transition-colors",
                location === link.href 
                  ? "text-primary bg-secondary/20" 
                  : "text-foreground hover:bg-secondary/10"
              )}
              data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif font-bold text-primary border-t border-border pt-4"
              data-testid="mobile-link-dashboard"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
