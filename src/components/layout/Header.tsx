
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  HomeIcon,
  BarChartIcon,
  BankIcon,
  SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ href, icon, children, active }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
    )}
  >
    <span className="text-current">{icon}</span>
    <span>{children}</span>
  </Link>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BankIcon className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">FinanceTrack</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavItem href="/" icon={<HomeIcon size={18} />} active={isActive("/")}>
            Home
          </NavItem>
          <NavItem href="/dashboard" icon={<BarChartIcon size={18} />} active={isActive("/dashboard")}>
            Dashboard
          </NavItem>
          <NavItem href="/transactions" icon={<BankIcon size={18} />} active={isActive("/transactions")}>
            Transactions
          </NavItem>
          <NavItem href="/notifications" icon={<BellIcon size={18} />} active={isActive("/notifications")}>
            Notifications
          </NavItem>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationClick}
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary animate-pulse" />
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link to="/login">
              <UserIcon className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 p-6 space-y-6">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <BankIcon className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">FinanceTrack</span>
          </Link>
          
          <nav className="flex flex-col space-y-4">
            <NavItem href="/" icon={<HomeIcon size={20} />} active={isActive("/")}>
              Home
            </NavItem>
            <NavItem href="/dashboard" icon={<BarChartIcon size={20} />} active={isActive("/dashboard")}>
              Dashboard
            </NavItem>
            <NavItem href="/transactions" icon={<BankIcon size={20} />} active={isActive("/transactions")}>
              Transactions
            </NavItem>
            <NavItem href="/notifications" icon={<BellIcon size={20} />} active={isActive("/notifications")}>
              Notifications
            </NavItem>
            <NavItem href="/settings" icon={<SettingsIcon size={20} />} active={isActive("/settings")}>
              Settings
            </NavItem>
          </nav>
          
          <div className="flex flex-col space-y-4 mt-auto">
            <Button className="w-full" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
