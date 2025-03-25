import React from "react";
import { Outlet } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  BarChartIcon, 
  BellIcon, 
  BuildingIcon, 
  SettingsIcon, 
  UserIcon, 
  ArrowRightCircleIcon,
  LogOutIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col min-h-screen pt-16">
          <div className="px-4 py-3 border-b bg-background/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <SidebarTrigger />
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <BellIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <BuildingIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FinanceTrack</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/dashboard") && "bg-sidebar-accent text-primary")}>
                  <Link to="/dashboard">
                    <HomeIcon className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/transactions") && "bg-sidebar-accent text-primary")}>
                  <Link to="/transactions">
                    <BuildingIcon className="h-4 w-4" />
                    <span>Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/analytics") && "bg-sidebar-accent text-primary")}>
                  <Link to="/analytics">
                    <BarChartIcon className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/notifications") && "bg-sidebar-accent text-primary")}>
                  <Link to="/notifications">
                    <BellIcon className="h-4 w-4" />
                    <span>Notifications</span>
                    <span className="ml-auto bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">3</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/connect-bank") && "bg-sidebar-accent text-primary")}>
                  <Link to="/connect-bank">
                    <ArrowRightCircleIcon className="h-4 w-4" />
                    <span>Connect Bank</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(isActive("/settings") && "bg-sidebar-accent text-primary")}>
                  <Link to="/settings">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/login">
              <LogOutIcon className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardLayout;
