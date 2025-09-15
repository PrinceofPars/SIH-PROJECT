import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { 
  Calendar, 
  Clock, 
  User, 
  Video,
  Phone,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  Plus,
  Filter,
  Search,
  Settings,
  Bell,
  FileText,
  BarChart3
} from "lucide-react";

interface CounselorDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

interface Appointment {
  id: string;
  studentId: string;
  studentName: string; // Anonymized
  date: Date;
  time: string;
  duration: number;
  type: 'individual' | 'group' | 'crisis';
  mode: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  followUpRequired?: boolean;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxAppointments: number;
}

interface SessionNote {
  id: string;
  appointmentId: string;
  content: string;
  timestamp: Date;
  tags: string[];
  riskAssessment?: 'low' | 'medium' | 'high' | 'crisis';
  followUpActions?: string[];
}

export function CounselorDashboard({ user }: CounselorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");

  // Mock data initialization
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        studentId: 'STU-2487',
        studentName: 'Student A',
        date: new Date(),
        time: '09:00',
        duration: 60,
        type: 'individual',
        mode: 'video',
        status: 'scheduled',
        urgency: 'medium',
        notes: 'Follow-up session for anxiety management'
      },
      {
        id: '2',
        studentId: 'STU-2486',
        studentName: 'Student B',
        date: new Date(),
        time: '11:00',
        duration: 60,
        type: 'individual',
        mode: 'in-person',
        status: 'scheduled',
        urgency: 'high',
        followUpRequired: true,
        notes: 'Crisis intervention follow-up'
      },
      {
        id: '3',
        studentId: 'STU-2485',
        studentName: 'Student C',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: '14:00',
        duration: 60,
        type: 'individual',
        mode: 'phone',
        status: 'scheduled',
        urgency: 'low'
      },
      {
        id: '4',
        studentId: 'STU-2484',
        studentName: 'Student D',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        time: '16:00',
        duration: 60,
        type: 'individual',
        mode: 'video',
        status: 'completed',
        urgency: 'medium'
      }
    ];

    const mockAvailability: AvailabilitySlot[] = [
      { id: '1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true, maxAppointments: 8 },
      { id: '2', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true, maxAppointments: 8 },
      { id: '3', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true, maxAppointments: 8 },
      { id: '4', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true, maxAppointments: 8 },
      { id: '5', dayOfWeek: 5, startTime: '09:00', endTime: '15:00', isAvailable: true, maxAppointments: 6 },
      { id: '6', dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isAvailable: false, maxAppointments: 0 },
      { id: '7', dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isAvailable: false, maxAppointments: 0 }
    ];

    const mockSessionNotes: SessionNote[] = [
      {
        id: '1',
        appointmentId: '4',
        content: 'Student showed improvement in anxiety management techniques. Discussed coping strategies for upcoming exams. Recommended continued practice of breathing exercises.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        tags: ['anxiety', 'coping-strategies', 'progress'],
        riskAssessment: 'medium',
        followUpActions: ['Schedule follow-up in 1 week', 'Monitor anxiety levels']
      }
    ];

    setTimeout(() => {
      setAppointments(mockAppointments);
      setAvailability(mockAvailability);
      setSessionNotes(mockSessionNotes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleStatusUpdate = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleAvailabilityToggle = (slotId: string) => {
    setAvailability(prev => prev.map(slot =>
      slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
    ));
  };

  const handleSaveNote = (appointmentId: string) => {
    if (!noteContent.trim()) return;

    const newNote: SessionNote = {
      id: Date.now().toString(),
      appointmentId,
      content: noteContent,
      timestamp: new Date(),
      tags: [],
      riskAssessment: 'medium'
    };

    setSessionNotes(prev => [...prev, newNote]);
    setNoteContent("");
    setEditingNote(null);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(apt => 
    apt.date > new Date() && apt.status === 'scheduled'
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
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
            <h2 className="text-2xl text-gray-900 mb-2">Counselor Dashboard</h2>
            <p className="text-gray-600">
              Manage your appointments and student sessions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="search" className="text-sm">Search:</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Student ID, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter(a => a.urgency === 'high' || a.urgency === 'crisis').length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.filter(a => a.followUpRequired).length} need follow-up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Crisis Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">
              {appointments.filter(a => a.urgency === 'crisis').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Management</TabsTrigger>
          <TabsTrigger value="notes">Session Notes</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          {/* Interactive Calendar/Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointment Schedule</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    onClick={() => setViewMode('day')}
                  >
                    Day
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    onClick={() => setViewMode('week')}
                  >
                    Week
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-mono text-sm">
                        <div>
                          <div>{appointment.time}</div>
                          <div className="text-xs text-gray-500">
                            {appointment.date.toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{appointment.studentName}</div>
                          <div className="text-xs text-gray-500 font-mono">{appointment.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {appointment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {appointment.mode === 'video' && <Video className="h-4 w-4" />}
                          {appointment.mode === 'phone' && <Phone className="h-4 w-4" />}
                          {appointment.mode === 'in-person' && <MapPin className="h-4 w-4" />}
                          <span className="text-sm capitalize">{appointment.mode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(appointment.urgency)}>
                          {appointment.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'in-progress')}
                            >
                              Start
                            </Button>
                          )}
                          {appointment.status === 'in-progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Session Details</DialogTitle>
                                <DialogDescription>
                                  {appointment.studentName} - {appointment.date.toLocaleDateString()} at {appointment.time}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Duration</Label>
                                    <div>{appointment.duration} minutes</div>
                                  </div>
                                  <div>
                                    <Label>Urgency Level</Label>
                                    <Badge className={getUrgencyColor(appointment.urgency)}>
                                      {appointment.urgency}
                                    </Badge>
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <div>
                                    <Label>Notes</Label>
                                    <div className="text-sm text-gray-600">{appointment.notes}</div>
                                  </div>
                                )}
                                {appointment.status === 'completed' && (
                                  <div>
                                    <Label>Session Notes</Label>
                                    {editingNote === appointment.id ? (
                                      <div className="space-y-2">
                                        <Textarea
                                          value={noteContent}
                                          onChange={(e) => setNoteContent(e.target.value)}
                                          placeholder="Enter session notes..."
                                          rows={4}
                                        />
                                        <div className="flex space-x-2">
                                          <Button
                                            size="sm"
                                            onClick={() => handleSaveNote(appointment.id)}
                                          >
                                            <Save className="h-4 w-4 mr-1" />
                                            Save
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingNote(null)}
                                          >
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setEditingNote(appointment.id);
                                            setNoteContent("");
                                          }}
                                        >
                                          <Edit className="h-4 w-4 mr-1" />
                                          Add Notes
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
              <CardDescription>
                Your appointment schedule for the current week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayAppointments = appointments.filter(apt => {
                    const aptDay = apt.date.getDay();
                    return aptDay === dayIndex;
                  });
                  
                  return (
                    <div key={dayIndex} className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">{getDayName(dayIndex)}</h4>
                      <div className="space-y-2">
                        {dayAppointments.length === 0 ? (
                          <div className="text-xs text-gray-500">No appointments</div>
                        ) : (
                          dayAppointments.map(apt => (
                            <div key={apt.id} className="text-xs p-2 bg-blue-50 rounded">
                              <div className="font-medium">{apt.time}</div>
                              <div className="text-gray-600">{apt.studentName}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>
                Review and manage your session documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium">
                          Appointment #{note.appointmentId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {note.timestamp.toLocaleString()}
                        </div>
                      </div>
                      {note.riskAssessment && (
                        <Badge className={getUrgencyColor(note.riskAssessment)}>
                          {note.riskAssessment} risk
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      {note.content}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {note.followUpActions && note.followUpActions.length > 0 && (
                      <div>
                        <Label className="text-xs">Follow-up Actions:</Label>
                        <ul className="text-xs text-gray-600 mt-1">
                          {note.followUpActions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>
                Set your working hours and availability for appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20">
                        <Label className="text-sm">{getDayName(slot.dayOfWeek)}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={slot.startTime}
                          className="w-24"
                          disabled={!slot.isAvailable}
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          className="w-24"
                          disabled={!slot.isAvailable}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Max appointments:</Label>
                        <Input
                          type="number"
                          value={slot.maxAppointments}
                          className="w-16"
                          disabled={!slot.isAvailable}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Available</Label>
                      <Switch
                        checked={slot.isAvailable}
                        onCheckedChange={() => handleAvailabilityToggle(slot.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}