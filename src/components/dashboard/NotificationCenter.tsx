
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bell, CheckIcon, ClockIcon, X, InfoIcon, AlertTriangleIcon, CheckCircleIcon, BookOpenIcon } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "alert" | "info" | "success" | "warning";
  isRead: boolean;
}

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "High-value transaction detected",
    description: "A transaction of $3,500.00 has been recorded from XYZ Corp.",
    timestamp: "2023-09-03T14:30:00",
    type: "info",
    isRead: false,
  },
  {
    id: "2",
    title: "Quarterly taxes due soon",
    description: "Your quarterly tax payment is due in 7 days.",
    timestamp: "2023-09-05T09:15:00",
    type: "warning",
    isRead: false,
  },
  {
    id: "3",
    title: "Bank connection synchronized",
    description: "Your bank accounts have been successfully synchronized.",
    timestamp: "2023-09-05T10:22:00",
    type: "success",
    isRead: true,
  },
  {
    id: "4",
    title: "Multiple unusual transactions",
    description: "We've detected multiple unusual transactions. Please review your recent activity.",
    timestamp: "2023-09-07T16:45:00",
    type: "alert",
    isRead: false,
  },
  {
    id: "5",
    title: "New invoice received",
    description: "You've received a new invoice from ABC Services for $1,250.00.",
    timestamp: "2023-09-10T11:30:00",
    type: "info",
    isRead: true,
  },
  {
    id: "6",
    title: "Audit trail generated",
    description: "Monthly audit trail has been generated for August 2023.",
    timestamp: "2023-09-01T08:00:00",
    type: "success",
    isRead: true,
  },
];

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const mins = Math.floor(diffInMs / (1000 * 60));
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    }
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case "alert":
      return <AlertTriangleIcon className="h-4 w-4 text-destructive" />;
    case "info":
      return <InfoIcon className="h-4 w-4 text-primary" />;
    case "success":
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case "warning":
      return <ClockIcon className="h-4 w-4 text-finance-pending" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [activeTab, setActiveTab] = useState("all");
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "alerts") return notification.type === "alert" || notification.type === "warning";
    return notification.type === activeTab;
  });
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-primary text-white">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay updated on important financial activities
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 text-xs rounded-full bg-primary/10 text-primary px-1.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
            <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0 space-y-4 animate-fade-in">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 border rounded-lg relative transition-all duration-200 group",
                    notification.isRead 
                      ? "border-border bg-card"
                      : "border-primary/20 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-background">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={cn(
                          "text-sm font-medium pr-6",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs text-primary hover:text-primary-foreground hover:bg-primary" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted/30 rounded-full p-4 mb-4">
                  <BookOpenIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium">No notifications found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                  {activeTab === "all" 
                    ? "You don't have any notifications at the moment." 
                    : `You don't have any ${activeTab === "unread" ? "unread" : activeTab} notifications.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
