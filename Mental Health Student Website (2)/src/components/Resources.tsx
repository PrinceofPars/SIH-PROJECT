import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Download, Phone, AlertCircle } from "lucide-react";

export function Resources() {
  const resources = [
    {
      category: "Immediate Help",
      items: [
        {
          title: "24/7 Crisis Hotline",
          description: "Immediate support for mental health emergencies",
          action: "Call Now",
          contact: "1-800-273-8255",
          urgent: true
        },
        {
          title: "Campus Emergency",
          description: "On-campus crisis intervention and immediate support",
          action: "Contact",
          contact: "Campus Security: ext. 911",
          urgent: true
        }
      ]
    },
    {
      category: "Self-Help Resources",
      items: [
        {
          title: "Mindfulness & Meditation Guide",
          description: "Learn techniques to manage stress and anxiety through mindfulness practices",
          action: "Download PDF",
          link: "#"
        },
        {
          title: "Study Stress Management",
          description: "Practical strategies for managing academic pressure and test anxiety",
          action: "View Guide",
          link: "#"
        },
        {
          title: "Sleep & Wellness Tips",
          description: "Improve your mental health through better sleep and self-care routines",
          action: "Read More",
          link: "#"
        }
      ]
    },
    {
      category: "Support Groups",
      items: [
        {
          title: "Anxiety Support Group",
          description: "Weekly meetings for students dealing with anxiety and panic disorders",
          schedule: "Wednesdays 6:00 PM",
          action: "Join Group"
        },
        {
          title: "Depression Support Circle",
          description: "Peer support group for students experiencing depression",
          schedule: "Fridays 4:00 PM",
          action: "Join Group"
        },
        {
          title: "Academic Stress Workshop",
          description: "Monthly workshops on managing academic pressure and perfectionism",
          schedule: "First Monday of each month",
          action: "Register"
        }
      ]
    }
  ];

  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl tracking-tight text-gray-900 mb-4">
            Mental Health Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access helpful resources, support groups, and self-help materials to support 
            your mental wellness journey.
          </p>
        </div>

        <div className="space-y-12">
          {resources.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl mb-6 text-gray-900">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex} 
                    className={`hover:shadow-lg transition-shadow ${
                      item.urgent ? 'border-red-200 bg-red-50' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex items-center">
                          {item.urgent && <AlertCircle className="h-5 w-5 text-red-600 mr-2" />}
                          {item.title}
                        </CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                      {item.schedule && (
                        <p className="text-sm text-blue-600 mt-2">{item.schedule}</p>
                      )}
                      {item.contact && (
                        <p className="text-sm text-red-600 mt-2">{item.contact}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className={`w-full ${
                          item.urgent 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        size="sm"
                      >
                        {item.action}
                        {item.link && <ExternalLink className="h-4 w-4 ml-2" />}
                        {item.contact && <Phone className="h-4 w-4 ml-2" />}
                        {item.action.includes('Download') && <Download className="h-4 w-4 ml-2" />}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl mb-4">Need Immediate Help?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you're experiencing a mental health emergency or having thoughts of self-harm, 
            please reach out for immediate support. You're not alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="h-5 w-5 mr-2" />
              Crisis Hotline: 988
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Campus Emergency
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}