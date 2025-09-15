import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  availability: string[];
  rating: number;
  languages: string[];
  type: 'individual' | 'group' | 'crisis';
  avatar?: string;
}

interface Appointment {
  id: string;
  counselorId: string;
  counselorName: string;
  date: Date;
  time: string;
  type: 'individual' | 'group' | 'crisis';
  mode: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface BookingSystemProps {
  user: { id: string; name: string; email: string; role: string };
}

export function BookingSystem({ user }: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState<'individual' | 'group' | 'crisis'>('individual');
  const [sessionMode, setSessionMode] = useState<'in-person' | 'video' | 'phone'>('in-person');
  const [notes, setNotes] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  // Mock counselors data
  const counselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      specializations: ['Anxiety', 'Depression', 'Academic Stress'],
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      rating: 4.9,
      languages: ['English', 'Hindi'],
      type: 'individual'
    },
    {
      id: '2',
      name: 'Dr. Raj Patel',
      title: 'Counseling Psychologist',
      specializations: ['Trauma', 'PTSD', 'Crisis Intervention'],
      availability: ['09:00', '10:00', '13:00', '14:00', '15:00'],
      rating: 4.8,
      languages: ['English', 'Hindi', 'Gujarati'],
      type: 'individual'
    },
    {
      id: '3',
      name: 'Ms. Priya Sharma',
      title: 'Group Therapy Specialist',
      specializations: ['Group Therapy', 'Peer Support', 'Social Anxiety'],
      availability: ['11:00', '14:00', '16:00', '17:00'],
      rating: 4.7,
      languages: ['English', 'Hindi', 'Marathi'],
      type: 'group'
    }
  ];

  // Mock existing appointments
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        counselorId: '1',
        counselorName: 'Dr. Sarah Johnson',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '14:00',
        type: 'individual',
        mode: 'video',
        status: 'scheduled'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const availableTimes = selectedCounselor?.availability || [];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedCounselor) return;

    setIsBooking(true);

    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        counselorId: selectedCounselor.id,
        counselorName: selectedCounselor.name,
        date: selectedDate,
        time: selectedTime,
        type: sessionType,
        mode: sessionMode,
        status: 'scheduled',
        notes: notes
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      // Reset form
      setSelectedTime("");
      setNotes("");
      setIsBooking(false);
      
      alert("Appointment booked successfully! You'll receive a confirmation email shortly.");
    }, 2000);
  };

  const filteredCounselors = counselors.filter(counselor => 
    sessionType === 'crisis' || counselor.type === sessionType || counselor.type === 'individual'
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-2">Book a Session</h2>
        <p className="text-gray-600">
          Schedule confidential sessions with our licensed mental health professionals
        </p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book">Book New Session</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div className="space-y-6">
              {/* Session Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Type</CardTitle>
                  <CardDescription>
                    Choose the type of support you need
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { 
                        value: 'individual', 
                        label: 'Individual Counseling', 
                        desc: 'One-on-one session with a counselor',
                        icon: User 
                      },
                      { 
                        value: 'group', 
                        label: 'Group Therapy', 
                        desc: 'Join a supportive group session',
                        icon: User 
                      },
                      { 
                        value: 'crisis', 
                        label: 'Crisis Intervention', 
                        desc: 'Immediate support for urgent situations',
                        icon: AlertCircle 
                      }
                    ].map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all ${
                          sessionType === type.value ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                        }`}
                        onClick={() => setSessionType(type.value as any)}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <type.icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="text-sm">{type.label}</h4>
                            <p className="text-xs text-gray-500">{type.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Session Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'in-person', label: 'In-Person', icon: MapPin },
                      { value: 'video', label: 'Video Call', icon: Video },
                      { value: 'phone', label: 'Phone Call', icon: Phone }
                    ].map((mode) => (
                      <Button
                        key={mode.value}
                        variant={sessionMode === mode.value ? 'default' : 'outline'}
                        onClick={() => setSessionMode(mode.value as any)}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <mode.icon className="h-5 w-5 mb-2" />
                        <span className="text-sm">{mode.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Counselor Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Counselor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredCounselors.map((counselor) => (
                      <Card 
                        key={counselor.id}
                        className={`cursor-pointer transition-all ${
                          selectedCounselor?.id === counselor.id ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCounselor(counselor)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm">{counselor.name}</h4>
                                <p className="text-xs text-gray-500">{counselor.title}</p>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {counselor.specializations.slice(0, 2).map((spec, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>⭐ {counselor.rating}</span>
                                <span>•</span>
                                <span>{counselor.languages.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date and Time Selection */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              {selectedCounselor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Times</CardTitle>
                    <CardDescription>
                      {selectedDate?.toLocaleDateString()} with {selectedCounselor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'default' : 'outline'}
                          onClick={() => setSelectedTime(time)}
                          size="sm"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                  <CardDescription>
                    Optional: Share what you'd like to discuss (confidential)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe what you'd like to focus on in this session..."
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Book Button */}
              <Button 
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || !selectedCounselor || isBooking}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking Session...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Book Session
                  </>
                )}
              </Button>

              {/* Confidentiality Notice */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="text-blue-900 mb-1">Confidential & Secure</h4>
                    <p className="text-blue-700 text-xs">
                      All sessions are confidential and comply with HIPAA regulations. 
                      Your privacy is our top priority.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Upcoming Appointments</h3>
              <Badge variant="outline">{appointments.length} scheduled</Badge>
            </div>

            {appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-600 mb-2">No appointments scheduled</h3>
                  <p className="text-gray-500">Book your first session to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm">{appointment.counselorName}</h4>
                            <Badge 
                              variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{appointment.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {appointment.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.mode}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="destructive">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}