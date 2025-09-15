import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Clock, Users, Heart } from "lucide-react";

export function About() {
  const stats = [
    { icon: Users, label: "Students Helped", value: "2,500+" },
    { icon: Clock, label: "Years Experience", value: "15+" },
    { icon: Award, label: "Success Rate", value: "95%" },
    { icon: Heart, label: "Satisfaction", value: "4.9/5" }
  ];

  const qualifications = [
    "Licensed Clinical Social Worker (LCSW)",
    "Master's in Clinical Psychology",
    "Certified in Trauma-Informed Care",
    "Specialized in Student Mental Health",
    "Crisis Intervention Certified"
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl tracking-tight text-gray-900">
                Meet Dr. Sarah Johnson
              </h2>
              <p className="text-xl text-gray-600">
                Licensed Mental Health Professional specializing in student wellness and academic success.
              </p>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>
                With over 15 years of experience in student mental health, I'm passionate about 
                helping young adults navigate the unique challenges of academic life. My approach 
                combines evidence-based therapy techniques with a deep understanding of student 
                culture and pressures.
              </p>
              <p>
                I believe that mental health is just as important as physical health, and every 
                student deserves access to compassionate, professional support. Whether you're 
                dealing with academic stress, relationship issues, anxiety, depression, or just 
                need someone to talk to, I'm here to help.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl text-gray-900">Qualifications & Certifications</h3>
              <ul className="space-y-2">
                {qualifications.map((qual, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {qual}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1700168333952-3d44a3f427af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Vuc2VsaW5nJTIwb2ZmaWNlJTIwY2FsbXxlbnwxfHx8fDE3NTc4ODQ3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dr. Sarah Johnson's office"
                className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="space-y-3">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-2xl text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl text-gray-900 mb-4">My Approach to Student Mental Health</h3>
            <p className="text-gray-600 mb-6">
              I believe in creating a safe, non-judgmental space where students can explore their 
              thoughts and feelings. My therapeutic approach is collaborative, culturally sensitive, 
              and tailored to each individual's needs and goals.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="text-lg text-gray-900">Evidence-Based</h4>
                <p className="text-sm text-gray-600">
                  Using proven therapeutic techniques like CBT, DBT, and mindfulness-based interventions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg text-gray-900">Student-Centered</h4>
                <p className="text-sm text-gray-600">
                  Understanding the unique pressures and experiences of student life in today's world.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg text-gray-900">Holistic Wellness</h4>
                <p className="text-sm text-gray-600">
                  Addressing mental health alongside academic success, relationships, and life goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}