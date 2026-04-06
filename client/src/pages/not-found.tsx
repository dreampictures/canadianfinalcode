import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <AlertCircle className="w-24 h-24 text-secondary mx-auto" />
        <h1 className="font-serif text-5xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 mt-4">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
