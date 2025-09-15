import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    preferredTime: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to a backend
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! We'll contact you within 24 hours to schedule your appointment.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      preferredTime: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(555) 123-4567",
      description: "Call us during business hours"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@mindcarestudent.com",
      description: "We respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "123 Campus Drive, Suite 200",
      description: "University Health Center"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Fri: 8AM-8PM",
      description: "Weekend emergency coverage"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl tracking-tight text-gray-900 mb-4">
            Schedule Your Appointment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to take the first step? Get in touch to schedule a consultation or ask any questions 
            about our mental health services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Book an Appointment</CardTitle>
              <CardDescription>
                Fill out the form below and we'll contact you within 24 hours to confirm your appointment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@university.edu"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Counseling</SelectItem>
                        <SelectItem value="group">Group Therapy</SelectItem>
                        <SelectItem value="crisis">Crisis Intervention</SelectItem>
                        <SelectItem value="academic">Academic Support</SelectItem>
                        <SelectItem value="wellness">Wellness Program</SelectItem>
                        <SelectItem value="consultation">Initial Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about what you'd like to discuss or any specific concerns..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Appointment
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  All information is kept strictly confidential. *Required fields
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <info.icon className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="space-y-1">
                      <h3 className="text-lg text-gray-900">{info.title}</h3>
                      <p className="text-blue-600">{info.details}</p>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl mb-4">Emergency Support</h3>
                <p className="text-blue-100 mb-6">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, 
                  please seek immediate help.
                </p>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    <Phone className="h-4 w-4 mr-2" />
                    Crisis Hotline: 988
                  </Button>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                    Campus Emergency: (555) 911-HELP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}