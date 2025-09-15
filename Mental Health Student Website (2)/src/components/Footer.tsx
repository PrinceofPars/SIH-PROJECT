import { Heart, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Resources", href: "#resources" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "Individual Counseling",
    "Group Therapy", 
    "Crisis Intervention",
    "Academic Support",
    "Wellness Programs"
  ];

  const emergencyContacts = [
    { name: "Crisis Hotline", contact: "988" },
    { name: "Campus Emergency", contact: "(555) 911-HELP" },
    { name: "National Suicide Prevention", contact: "1-800-273-8255" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl">MindCare Student Support</span>
            </div>
            <p className="text-gray-400 text-sm">
              Professional mental health support designed specifically for students. 
              We're here to help you navigate academic stress and build resilience for a healthier life.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Campus Drive, Suite 200</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@mindcarestudent.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg text-red-400">Emergency Support</h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="text-sm">
                  <p className="text-gray-300">{contact.name}</p>
                  <p className="text-red-400">{contact.contact}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800">
              <p className="text-red-300 text-xs">
                If you're experiencing a mental health emergency, please call 911 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} MindCare Student Support. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">HIPAA Notice</a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            Licensed mental health services. All sessions are confidential and comply with HIPAA regulations.
          </div>
        </div>
      </div>
    </footer>
  );
}