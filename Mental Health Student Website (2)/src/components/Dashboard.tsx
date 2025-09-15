import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  BarChart3, 
  Heart,
  Settings,
  Bell,
  User,
  Shield,
  LogOut
} from "lucide-react";
import { AIChat } from "./AIChat";
import { BookingSystem } from "./BookingSystem";
import { ResourceHub } from "./ResourceHub";
import { PeerSupport } from "./PeerSupport";
import { AdminDashboard } from "./AdminDashboard";
import { CounselorDashboard } from "./CounselorDashboard";
import { ScreeningTools } from "./ScreeningTools";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  avatar?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  // Set default active tab based on user role
  const getDefaultTab = () => {
    if (user.role === 'admin') return 'admin';
    if (user.role === 'counselor') return 'counselor';
    return 'chat';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [notifications, setNotifications] = useState(3);

  // Define tabs based on user role
  let tabs = [];

  if (user.role === 'admin') {
    tabs = [
      {
        id: "admin",
        label: "Analytics",
        icon: BarChart3,
        description: "View usage analytics and intervention trends"
      },
      {
        id: "community",
        label: "Peer Support",
        icon: Users,
        description: "Connect with peer support community"
      }
    ];
  } else if (user.role === 'counselor') {
    tabs = [
      {
        id: "counselor",
        label: "My Schedule",
        icon: Calendar,
        description: "Manage appointments and student sessions"
      },
      {
        id: "community",
        label: "Peer Support",
        icon: Users,
        description: "Connect with peer support community"
      }
    ];
  } else {
    // Student tabs - keep all original functionality
    tabs = [
      {
        id: "chat",
        label: "AI Support",
        icon: MessageCircle,
        description: "Get immediate AI-guided support and coping strategies"
      },
      {
        id: "booking",
        label: "Book Session",
        icon: Calendar,
        description: "Schedule appointments with counselors"
      },
      {
        id: "resources",
        label: "Resources",
        icon: BookOpen,
        description: "Access educational materials and wellness content"
      },
      {
        id: "community",
        label: "Peer Support",
        icon: Users,
        description: "Connect with peer support community"
      },
      {
        id: "screening",
        label: "Self-Assessment",
        icon: Heart,
        description: "Take psychological screening assessments"
      }
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl">MindCare Dashboard</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600">
            Your mental wellness journey continues here. Choose what you need today.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" defaultValue={tabs[0]?.id || "community"}>
          {/* Tab Navigation */}
          <div className={`grid gap-4 ${
            user.role === 'admin' || user.role === 'counselor' 
              ? 'grid-cols-2' 
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
          }`}>
            {tabs.map((tab) => (
              <Card 
                key={tab.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === tab.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardContent className="p-4 text-center">
                  <tab.icon className={`h-8 w-8 mx-auto mb-2 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h3 className="text-sm mb-1">{tab.label}</h3>
                  <p className="text-xs text-gray-500">{tab.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border">
            {/* Student-only tabs */}
            {user.role === 'student' && (
              <>
                <TabsContent value="chat" className="m-0">
                  <AIChat user={user} />
                </TabsContent>
                
                <TabsContent value="booking" className="m-0">
                  <BookingSystem user={user} />
                </TabsContent>
                
                <TabsContent value="resources" className="m-0">
                  <ResourceHub user={user} />
                </TabsContent>

                <TabsContent value="screening" className="m-0">
                  <ScreeningTools user={user} />
                </TabsContent>
              </>
            )}

            {/* Shared tab - Peer Support (available to all roles) */}
            <TabsContent value="community" className="m-0">
              <PeerSupport user={user} />
            </TabsContent>
            
            {/* Admin-only tab */}
            {user.role === 'admin' && (
              <TabsContent value="admin" className="m-0">
                <AdminDashboard user={user} />
              </TabsContent>
            )}

            {/* Counselor-only tab */}
            {user.role === 'counselor' && (
              <TabsContent value="counselor" className="m-0">
                <CounselorDashboard user={user} />
              </TabsContent>
            )}
          </div>
        </Tabs>

        {/* Emergency Support Banner */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-red-800">Need Immediate Help?</h3>
                <p className="text-red-600 text-sm">
                  If you're experiencing a mental health crisis, please reach out immediately.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Crisis Hotline: 988
              </Button>
              <Button size="sm" variant="outline" className="border-red-600 text-red-600">
                Campus Emergency
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}