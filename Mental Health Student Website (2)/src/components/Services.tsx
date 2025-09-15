import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Brain, Users, Calendar, MessageCircle, BookOpen, Shield } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Brain,
      title: "Individual Counseling",
      description: "One-on-one sessions tailored to your specific needs, focusing on academic stress, anxiety, depression, and personal growth.",
      features: ["50-minute sessions", "Flexible scheduling", "Multiple therapy approaches"]
    },
    {
      icon: Users,
      title: "Group Therapy",
      description: "Connect with fellow students facing similar challenges in a supportive group environment.",
      features: ["Weekly sessions", "Peer support", "Skill-building workshops"]
    },
    {
      icon: Calendar,
      title: "Crisis Intervention",
      description: "Immediate support available 24/7 for urgent mental health situations and crisis management.",
      features: ["24/7 availability", "Emergency protocols", "Safety planning"]
    },
    {
      icon: MessageCircle,
      title: "Peer Support",
      description: "Trained student peer counselors provide additional support and understanding from shared experiences.",
      features: ["Student-led", "Informal setting", "Ongoing support"]
    },
    {
      icon: BookOpen,
      title: "Academic Support",
      description: "Specialized counseling to help manage academic stress, study anxiety, and performance pressure.",
      features: ["Study strategies", "Test anxiety", "Time management"]
    },
    {
      icon: Shield,
      title: "Wellness Programs",
      description: "Preventive mental health programs including mindfulness, stress management, and self-care workshops.",
      features: ["Mindfulness training", "Stress workshops", "Self-care practices"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl tracking-tight text-gray-900 mb-4">
            Comprehensive Mental Health Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a full range of mental health services designed specifically for the unique 
            challenges and experiences of student life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <service.icon className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}