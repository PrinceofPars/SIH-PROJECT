import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  Eye,
  FileText,
  BarChart3,
  Activity
} from "lucide-react";

interface AdminDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  crisisInterventions: number;
  completedAssessments: number;
  riskDistribution: { level: string; count: number; color: string; }[];
  usageByTime: { hour: number; users: number; }[];
  serviceUsage: { service: string; usage: number; }[];
  monthlyTrends: { month: string; users: number; sessions: number; assessments: number; }[];
  topConcerns: { concern: string; count: number; }[];
}

interface StudentData {
  id: string;
  anonymizedId: string;
  riskLevel: string;
  lastActive: string;
  sessionsCount: number;
  assessmentScore: number;
  concerns: string[];
  trend: 'improving' | 'stable' | 'declining';
}

interface CrisisAlert {
  id: string;
  anonymizedId: string;
  timestamp: string;
  severity: 'High' | 'Critical';
  status: 'Active' | 'In Progress' | 'Resolved';
  responseTime?: string;
  assignedCounselor?: string;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  // Load real-time analytics from server
  useEffect(() => {
    loadAnalytics();
    // Set up real-time updates
    const interval = setInterval(loadAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Import Supabase config (this will be available when the component loads)
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/analytics`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const serverAnalytics = await response.json();
        setAnalytics(serverAnalytics);
      } else {
        // Fallback to mock data if server unavailable
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to mock data
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    const mockAnalytics: Analytics = {
      totalUsers: 2487,
      activeUsers: 892,
      totalSessions: 1256,
      avgSessionDuration: 42,
      crisisInterventions: 23,
      completedAssessments: 567,
      riskDistribution: [
        { level: 'Low Risk', count: 1245, color: '#10B981' },
        { level: 'Moderate Risk', count: 789, color: '#F59E0B' },
        { level: 'High Risk', count: 234, color: '#EF4444' },
        { level: 'Crisis', count: 23, color: '#7C2D12' }
      ],
      usageByTime: [
        { hour: 0, users: 12 },
        { hour: 1, users: 8 },
        { hour: 2, users: 5 },
        { hour: 6, users: 25 },
        { hour: 8, users: 45 },
        { hour: 10, users: 78 },
        { hour: 12, users: 89 },
        { hour: 14, users: 95 },
        { hour: 16, users: 112 },
        { hour: 18, users: 98 },
        { hour: 20, users: 85 },
        { hour: 22, users: 67 },
        { hour: 23, users: 34 }
      ],
      serviceUsage: [
        { service: 'AI Chat Support', usage: 1456 },
        { service: 'Counseling Sessions', usage: 892 },
        { service: 'Resource Hub', usage: 756 },
        { service: 'Peer Support', usage: 634 },
        { service: 'Self-Assessments', usage: 567 }
      ],
      monthlyTrends: [
        { month: 'Jan', users: 1200, sessions: 856, assessments: 234 },
        { month: 'Feb', users: 1350, sessions: 945, assessments: 267 },
        { month: 'Mar', users: 1489, sessions: 1023, assessments: 298 },
        { month: 'Apr', users: 1678, sessions: 1156, assessments: 345 },
        { month: 'May', users: 1892, sessions: 1287, assessments: 398 },
        { month: 'Jun', users: 2089, sessions: 1423, assessments: 456 },
        { month: 'Jul', users: 2234, sessions: 1534, assessments: 489 },
        { month: 'Aug', users: 2367, sessions: 1634, assessments: 523 },
        { month: 'Sep', users: 2487, sessions: 1756, assessments: 567 }
      ],
      topConcerns: [
        { concern: 'Academic Stress', count: 892 },
        { concern: 'Anxiety', count: 745 },
        { concern: 'Depression', count: 567 },
        { concern: 'Sleep Issues', count: 434 },
        { concern: 'Relationship Problems', count: 298 },
        { concern: 'Identity Issues', count: 234 },
        { concern: 'Eating Disorders', count: 156 }
      ]
    };

    const mockStudentData: StudentData[] = [
      { id: '1', anonymizedId: 'STU-2487', riskLevel: 'High Risk', lastActive: '2 hours ago', sessionsCount: 8, assessmentScore: 18, concerns: ['Anxiety', 'Academic Stress'], trend: 'improving' },
      { id: '2', anonymizedId: 'STU-2486', riskLevel: 'Crisis', lastActive: '30 minutes ago', sessionsCount: 12, assessmentScore: 22, concerns: ['Depression', 'Suicidal Ideation'], trend: 'declining' },
      { id: '3', anonymizedId: 'STU-2485', riskLevel: 'Moderate Risk', lastActive: '1 day ago', sessionsCount: 5, assessmentScore: 12, concerns: ['Sleep Issues', 'Stress'], trend: 'stable' },
      { id: '4', anonymizedId: 'STU-2484', riskLevel: 'Low Risk', lastActive: '3 hours ago', sessionsCount: 3, assessmentScore: 6, concerns: ['Academic Stress'], trend: 'improving' },
      { id: '5', anonymizedId: 'STU-2483', riskLevel: 'High Risk', lastActive: '1 hour ago', sessionsCount: 15, assessmentScore: 19, concerns: ['Anxiety', 'Panic Attacks'], trend: 'stable' }
    ];

    const mockCrisisAlerts: CrisisAlert[] = [
      { id: '1', anonymizedId: 'STU-2486', timestamp: '30 minutes ago', severity: 'Critical', status: 'In Progress', assignedCounselor: 'Dr. Sarah Johnson' },
      { id: '2', anonymizedId: 'STU-2487', timestamp: '2 hours ago', severity: 'High', status: 'Resolved', responseTime: '3 minutes', assignedCounselor: 'Dr. Raj Patel' },
      { id: '3', anonymizedId: 'STU-2482', timestamp: '5 hours ago', severity: 'Critical', status: 'Resolved', responseTime: '2 minutes', assignedCounselor: 'Dr. Sarah Johnson' }
    ];

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setStudentData(mockStudentData);
      setCrisisAlerts(mockCrisisAlerts);
    }, 1000);
  };

  const refreshData = () => {
    setIsLoading(true);
    loadAnalytics();
  };

  const exportData = (type: string) => {
    // Simulate data export
    const exportData = {
      analytics,
      studentData: studentData.map(s => ({ ...s, id: undefined })), // Remove actual ID for privacy
      crisisAlerts: crisisAlerts.map(c => ({ ...c, id: undefined })),
      exportedAt: new Date().toISOString(),
      timeRange,
      exportType: type
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mental-health-analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChartClick = (data: any, chartType: string) => {
    setSelectedDetail({ data, chartType });
    setShowDetailModal(true);
  };

  const filteredStudentData = studentData.filter(student => {
    const matchesFilter = selectedFilter === 'all' || student.riskLevel.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesSearch = student.anonymizedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.concerns.some(concern => concern.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low Risk': return 'text-green-600 bg-green-100';
      case 'Moderate Risk': return 'text-yellow-600 bg-yellow-100';
      case 'High Risk': return 'text-orange-600 bg-orange-100';
      case 'Crisis': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">
              Monitor usage patterns and identify mental health trends
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="search" className="text-sm">Search:</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search students, concerns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="crisis">Crisis</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshData} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Data</DialogTitle>
                  <DialogDescription>
                    Select the type of data export you need
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button onClick={() => exportData('full')} className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Full Analytics Report
                  </Button>
                  <Button onClick={() => exportData('summary')} variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Executive Summary
                  </Button>
                  <Button onClick={() => exportData('crisis')} variant="outline" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Crisis Reports Only
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="students">Student Monitoring</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{analytics?.totalUsers?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Active Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{analytics?.activeUsers?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.activeUsers && analytics?.totalUsers ? ((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1) : 0}% engagement rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{analytics?.totalSessions?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Avg {analytics?.avgSessionDuration || 0} min duration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Crisis Interventions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600">{analytics?.crisisInterventions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Immediate support provided
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Service Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Service Usage Distribution</CardTitle>
              <CardDescription>
                Most popular mental health services (Click bars for details)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.serviceUsage || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="usage" 
                    fill="#3B82F6" 
                    onClick={(data) => handleChartClick(data, 'serviceUsage')}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Concerns */}
          <Card>
            <CardHeader>
              <CardTitle>Top Mental Health Concerns</CardTitle>
              <CardDescription>
                Most frequently reported issues by students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.topConcerns?.length > 0 ? (
                  analytics.topConcerns.map((concern, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{concern.concern}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${analytics.topConcerns?.[0] ? (concern.count / analytics.topConcerns[0].count) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">{concern.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No concern data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage by Time of Day */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns by Time of Day</CardTitle>
              <CardDescription>
                When students are most likely to seek support (Click points for details)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.usageByTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `${value}:00`}
                    formatter={(value) => [value, 'Active Users']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    onClick={(data) => handleChartClick(data, 'usageByTime')}
                    style={{ cursor: 'pointer' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Usage */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Mobile</span>
                    <span>68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desktop</span>
                    <span>28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tablet</span>
                    <span>4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>English</span>
                    <span>45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hindi</span>
                    <span>28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamil</span>
                    <span>12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>
                Current mental health risk assessment across users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.riskDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ level, count }) => `${level}: ${count}`}
                    >
                      {(analytics?.riskDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {(analytics?.riskDistribution || []).map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: risk.color }}
                        ></div>
                        <span>{risk.level}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg">{risk.count}</div>
                        <div className="text-xs text-gray-500">
                          {analytics?.totalUsers ? ((risk.count / analytics.totalUsers) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Recent Crisis Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 1, time: '2 hours ago', severity: 'High', status: 'Resolved' },
                  { id: 2, time: '5 hours ago', severity: 'Critical', status: 'In Progress' },
                  { id: 3, time: '1 day ago', severity: 'High', status: 'Resolved' }
                ].map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'
                      }`}></div>
                      <div>
                        <span className="text-sm">Crisis Alert #{alert.id}</span>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={alert.status === 'Resolved' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {alert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Student Data Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Total Students Monitored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{studentData.length}</div>
                <p className="text-sm text-gray-600">Active in monitoring system</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  High Priority Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-red-600">
                  {studentData.filter(s => s.riskLevel === 'Crisis' || s.riskLevel === 'High Risk').length}
                </div>
                <p className="text-sm text-gray-600">Require immediate attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Improving Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-green-600">
                  {studentData.filter(s => s.trend === 'improving').length}
                </div>
                <p className="text-sm text-gray-600">Showing positive progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Student Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Monitoring Data</CardTitle>
              <CardDescription>
                Anonymized student data for privacy protection ({filteredStudentData.length} of {studentData.length} students shown)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Assessment Score</TableHead>
                    <TableHead>Primary Concerns</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudentData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">{student.anonymizedId}</TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(student.riskLevel)}>
                          {student.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{student.lastActive}</TableCell>
                      <TableCell>{student.sessionsCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{student.assessmentScore}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            student.assessmentScore >= 20 ? 'bg-red-500' :
                            student.assessmentScore >= 15 ? 'bg-orange-500' :
                            student.assessmentScore >= 10 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.concerns.slice(0, 2).map((concern, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {concern}
                            </Badge>
                          ))}
                          {student.concerns.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.concerns.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(student.trend)}
                          <span className="text-sm capitalize">{student.trend}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Student Details - {student.anonymizedId}</DialogTitle>
                              <DialogDescription>
                                Detailed monitoring information (anonymized for privacy)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Risk Level</Label>
                                  <div>
                                    <Badge className={getRiskColor(student.riskLevel)}>
                                      {student.riskLevel}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label>Trend</Label>
                                  <div className="flex items-center space-x-1">
                                    {getTrendIcon(student.trend)}
                                    <span className="capitalize">{student.trend}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Assessment Score</Label>
                                  <div>{student.assessmentScore}/24</div>
                                </div>
                                <div>
                                  <Label>Total Sessions</Label>
                                  <div>{student.sessionsCount}</div>
                                </div>
                              </div>
                              <div>
                                <Label>Primary Concerns</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {student.concerns.map((concern, index) => (
                                    <Badge key={index} variant="outline">
                                      {concern}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label>Last Activity</Label>
                                <div>{student.lastActive}</div>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                                <ul className="text-sm space-y-1">
                                  {student.riskLevel === 'Crisis' && (
                                    <li>• Immediate crisis intervention required</li>
                                  )}
                                  {student.riskLevel === 'High Risk' && (
                                    <li>• Schedule follow-up within 24 hours</li>
                                  )}
                                  {student.trend === 'declining' && (
                                    <li>• Consider increasing session frequency</li>
                                  )}
                                  {student.sessionsCount < 3 && (
                                    <li>• Encourage engagement with support services</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Crisis Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Real-time Crisis Alerts
              </CardTitle>
              <CardDescription>
                Active and recent crisis interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crisisAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{alert.anonymizedId}</span>
                          <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        {alert.assignedCounselor && (
                          <p className="text-xs text-gray-600">Assigned: {alert.assignedCounselor}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={alert.status === 'Resolved' ? 'default' : 'destructive'}
                        className="mb-1"
                      >
                        {alert.status}
                      </Badge>
                      {alert.responseTime && (
                        <p className="text-xs text-gray-500">Response: {alert.responseTime}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
              <CardDescription>
                Platform adoption and usage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} name="Sessions" />
                  <Line type="monotone" dataKey="assessments" stroke="#F59E0B" strokeWidth={2} name="Assessments" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          {/* Intervention Effectiveness */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600">
                    Successful crisis interventions in the last 30 days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl text-blue-600">2.3 min</div>
                  <p className="text-sm text-gray-600">
                    Average time to connect with crisis support
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resource Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                Based on current data trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Increase Evening Support</h4>
                    <p className="text-sm text-gray-600">
                      Usage peaks at 4-6 PM. Consider adding more counselor availability during these hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Academic Stress Resources</h4>
                    <p className="text-sm text-gray-600">
                      High volume of academic stress concerns. Consider expanding study support resources.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Mobile Experience</h4>
                    <p className="text-sm text-gray-600">
                      68% mobile usage indicates strong mobile optimization is working well.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chart Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chart Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected data point
            </DialogDescription>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(selectedDetail, null, 2)}
                </pre>
              </div>
              <div className="text-sm text-gray-600">
                Click on charts to explore detailed breakdowns and additional insights.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}