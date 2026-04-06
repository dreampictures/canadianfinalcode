import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

const loginSchema = api.auth.login.input;

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });

  useEffect(() => {
    if (user) {
      window.location.href = "/admin";
    }
  }, [user]);

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login(data);
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md water-drop-gradient rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Admin Access</h1>
          <p className="text-foreground">Enter your credentials to manage the salon.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      autoComplete="username"
                      className="h-12 water-drop-input rounded-xl" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        {...field} 
                        className="h-12 water-drop-input rounded-xl pr-12" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button 
              type="submit" 
              className="w-full h-12 glass-button-secondary rounded-xl font-bold flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Login
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
