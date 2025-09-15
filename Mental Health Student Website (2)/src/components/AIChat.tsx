import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Heart, 
  Clock,
  Lightbulb,
  Phone,
  MessageSquare,
  BookOpen,
  Calendar,
  ExternalLink
} from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'normal' | 'crisis' | 'referral' | 'coping';
  riskLevel?: 'low' | 'moderate' | 'high' | 'crisis';
}

interface AIChatProps {
  user: { id: string; name: string; email: string; role: string };
}

interface CrisisResponse {
  crisis: boolean;
  intervention?: {
    autoBooking: boolean;
    appointmentId?: string;
    appointment?: any;
    message: string;
  };
}

interface ResourceSuggestion {
  videos?: Array<{ title: string; url: string; description: string }>;
  books?: Array<{ title: string; author: string; url: string; description: string }>;
  articles?: Array<{ title: string; url: string; description: string }>;
  crisis?: Array<{ title: string; description: string; type: string }>;
}

export function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [currentRiskLevel, setCurrentRiskLevel] = useState<'low' | 'moderate' | 'high' | 'crisis'>('low');
  const [crisisAlert, setCrisisAlert] = useState<CrisisResponse | null>(null);
  const [suggestedResources, setSuggestedResources] = useState<ResourceSuggestion | null>(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello ${user.name.split(' ')[0]}! I'm MindBot, your AI mental health companion. I'm here to provide immediate support, coping strategies, and help you navigate your mental wellness journey. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
    };
    setMessages([welcomeMessage]);
  }, [user.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle crisis alerts
  useEffect(() => {
    if (crisisAlert?.crisis) {
      // Show crisis intervention UI
      const crisisMessage: Message = {
        id: `crisis_${Date.now()}`,
        content: crisisAlert.intervention?.message || "Crisis detected. Please seek immediate help.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'crisis',
        riskLevel: 'crisis'
      };
      setMessages(prev => [...prev, crisisMessage]);
      
      // Auto-suggest resources
      handleResourceSuggestion('crisis', 'crisis');
    }
  }, [crisisAlert]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'normal'
    };

    setMessages(prev => [...prev, userMsg]);
    const messageToSend = newMessage;
    setNewMessage("");
    setIsTyping(true);

    try {
      // Send message to AI service with risk assessment
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user.id,
          message: messageToSend,
          sessionId
        })
      });

      const data = await response.json();
      
      // Update risk level
      if (data.riskLevel) {
        setCurrentRiskLevel(data.riskLevel);
      }

      // Handle crisis response
      if (data.crisis) {
        setCrisisAlert(data);
      }

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        type: data.crisis ? 'crisis' : 'normal',
        riskLevel: data.riskLevel
      };

      setMessages(prev => [...prev, aiResponse]);

      // TODO: ML/DL INTEGRATION POINT
      // The server endpoint '/ai-chat' includes a placeholder function `analyzeMessageRisk`
      // Replace this with your ML/DL model that analyzes message content for:
      // - Risk levels: 'low', 'moderate', 'high', 'crisis'
      // - Emotional state detection
      // - Intent classification
      // - Crisis intervention triggers

      // Suggest resources based on detected problems
      if (data.riskLevel !== 'low') {
        const problemType = detectProblemType(messageToSend);
        handleResourceSuggestion(problemType, data.riskLevel);
      }

    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact a counselor directly if you need immediate support.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'normal'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const detectProblemType = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) return 'anxiety';
    if (lowerMessage.includes('depressed') || lowerMessage.includes('depression')) return 'depression';
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) return 'stress';
    return 'general';
  };

  const handleResourceSuggestion = async (problemType: string, riskLevel: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/get-resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ problemType, riskLevel })
      });

      const data = await response.json();
      setSuggestedResources(data.resources);
      setShowResourceDialog(true);
    } catch (error) {
      console.error('Resource suggestion error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRiskLevelColor = () => {
    switch (currentRiskLevel) {
      case 'crisis': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getRiskLevelText = () => {
    switch (currentRiskLevel) {
      case 'crisis': return 'Crisis Detected';
      case 'high': return 'High Risk';
      case 'moderate': return 'Moderate Risk';
      default: return 'Low Risk';
    }
  };

  const quickActions = [
    { label: "I'm feeling anxious", action: () => setNewMessage("I'm feeling anxious and overwhelmed") },
    { label: "Academic stress", action: () => setNewMessage("I'm stressed about my studies and exams") },
    { label: "Can't sleep", action: () => setNewMessage("I'm having trouble sleeping") },
    { label: "Feeling lonely", action: () => setNewMessage("I'm feeling lonely and isolated") }
  ];

  return (
    <div className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Mental Health Support</CardTitle>
              <CardDescription>
                24/7 immediate support with intelligent risk assessment
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getRiskLevelColor()}>
              {getRiskLevelText()}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => handleResourceSuggestion('general', currentRiskLevel)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Resources
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Crisis Alert */}
      {crisisAlert?.crisis && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <p><strong>Crisis detected.</strong> {crisisAlert.intervention?.message}</p>
              {crisisAlert.intervention?.autoBooking && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Emergency appointment automatically scheduled</span>
                </div>
              )}
              <div className="flex space-x-2 mt-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 988 Now
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowResourceDialog(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Crisis Resources
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {message.sender === 'ai' && (
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'crisis'
                        ? 'bg-red-50 border border-red-200 text-red-900'
                        : message.type === 'coping'
                        ? 'bg-green-50 border border-green-200 text-green-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2 flex items-center justify-between">
                      <span>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.riskLevel && message.sender === 'ai' && (
                        <Badge variant="outline" className="text-xs">
                          Risk: {message.riskLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="border-t p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Quick responses:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={action.action}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>Confidential & Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Available 24/7</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3" />
              <span>AI Risk Assessment</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Resource Suggestion Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recommended Resources</DialogTitle>
            <DialogDescription>
              Here are some resources that might help based on our conversation
            </DialogDescription>
          </DialogHeader>
          
          {suggestedResources && (
            <div className="space-y-6">
              {/* Crisis Resources */}
              {suggestedResources.crisis && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-3">🚨 Crisis Support</h3>
                  <div className="space-y-2">
                    {suggestedResources.crisis.map((resource, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription>
                          <strong>{resource.title}</strong><br />
                          {resource.description}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {suggestedResources.videos && (
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">📹 Helpful Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedResources.videos.map((video, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{video.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                          <Button size="sm" variant="outline" asChild>
                            <a href={video.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Watch Video
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              {suggestedResources.books && (
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">📚 Recommended Reading</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedResources.books.map((book, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1">{book.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
                          <p className="text-sm text-gray-600 mb-3">{book.description}</p>
                          <Button size="sm" variant="outline" asChild>
                            <a href={book.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Book
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {suggestedResources.articles && (
                <div>
                  <h3 className="font-semibold text-purple-600 mb-3">📖 Articles</h3>
                  <div className="space-y-3">
                    {suggestedResources.articles.map((article, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium mb-1">{article.title}</h4>
                              <p className="text-sm text-gray-600">{article.description}</p>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={article.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Read
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}