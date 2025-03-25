
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { ArrowRightIcon, BankIcon, BellIcon, CheckIcon, CloudIcon, CreditCardIcon, DatabaseIcon, LockIcon, ShieldIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <BankIcon className="h-5 w-5" />,
    title: "Bank Synchronization",
    description: "Connect multiple bank accounts and automatically import transactions in real-time."
  },
  {
    icon: <BellIcon className="h-5 w-5" />,
    title: "Smart Notifications",
    description: "Get instant alerts for high-value transactions, unusual activity, and payment deadlines."
  },
  {
    icon: <LockIcon className="h-5 w-5" />,
    title: "Secure Dashboard",
    description: "Access your financial data from a secure, role-based dashboard with detailed audit logs."
  },
  {
    icon: <DatabaseIcon className="h-5 w-5" />,
    title: "Automated Bookkeeping",
    description: "Categorize transactions automatically with AI-powered processing and rule-based matching."
  },
  {
    icon: <CreditCardIcon className="h-5 w-5" />,
    title: "Payment Tracking",
    description: "Track outgoing payments, recurring expenses, and receivables in a unified interface."
  },
  {
    icon: <ShieldIcon className="h-5 w-5" />,
    title: "Enterprise Security",
    description: "Bank-level encryption, multi-factor authentication, and comprehensive access controls."
  }
];

const testimonials = [
  {
    text: "This platform has transformed how we handle our financial tracking. The real-time notifications save our bookkeeping team hours every week.",
    author: "Sarah Johnson",
    role: "CFO, TechVenture Inc."
  },
  {
    text: "The secure dashboard and bank integration features make reconciliation so much faster. We can't imagine going back to our old system.",
    author: "Michael Chen",
    role: "Financial Controller, GrowthWave"
  },
  {
    text: "Setting up automated payment tracking has been a game-changer for our cash flow management. Highly recommended for any business.",
    author: "Alex Rodriguez",
    role: "Small Business Owner"
  }
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="pt-28 pb-16 px-4 opacity-0 transition-opacity duration-700 ease-in-out"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/5 border-primary/20 text-primary">
              <CloudIcon className="h-3.5 w-3.5 mr-1" />
              Financial Tracking Simplified
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-balance leading-tight">
              Real-time Payment Tracking <br className="hidden md:block" />
              <span className="text-primary">for Modern Bookkeepers</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect your bank accounts, monitor transactions in real-time, and receive 
              intelligent notifications for streamlined financial management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative mt-16 rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10"></div>
            <img 
              src="https://placehold.co/1200x600/e2e8f0/a0aec0?text=Dashboard Preview" 
              alt="Dashboard Preview"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
          
          {/* Trusted By */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by forward-thinking companies
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-32 bg-muted/30 rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">COMPANY {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div 
        ref={featuresRef}
        className="py-20 bg-muted/20 opacity-0 transition-opacity duration-700 ease-in-out"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive Financial Tracking
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to monitor, analyze, and secure your financial data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={cn(
                "border bg-card transition-all duration-500 hover:border-primary/20 hover:shadow-md overflow-hidden",
                `transition-delay-${index * 100}`
              )}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied financial professionals who trust our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-muted/5 border">
                <CardContent className="p-6">
                  <div className="mb-4 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="inline-block mr-1">★</span>
                    ))}
                  </div>
                  <p className="italic mb-6">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div 
        ref={ctaRef}
        className="py-20 px-4 bg-primary/5 opacity-0 transition-opacity duration-700 ease-in-out"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Streamline Your Financial Tracking?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of businesses that use our platform to simplify their bookkeeping process.
          </p>
          
          <div className="max-w-xl mx-auto bg-card rounded-xl p-6 border shadow-lg">
            <div className="grid gap-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <CheckIcon className="h-4 w-4" />
                </div>
                <p className="font-medium">Unlimited real-time notifications</p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <CheckIcon className="h-4 w-4" />
                </div>
                <p className="font-medium">Connect up to 10 bank accounts</p>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <CheckIcon className="h-4 w-4" />
                </div>
                <p className="font-medium">Team collaboration with unlimited users</p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/dashboard">
                    Start 14-Day Free Trial
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BankIcon className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-lg">FinanceTrack</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time payment tracking and financial notifications for modern bookkeepers.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                  <a key={social} href="#" className="text-muted-foreground hover:text-primary text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Integrations', 'Pricing', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} FinanceTrack. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
