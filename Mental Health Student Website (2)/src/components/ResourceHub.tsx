import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  BookOpen, 
  Video, 
  Headphones, 
  Download, 
  Play, 
  Pause,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Globe
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'pdf' | 'article';
  category: string;
  language: string;
  duration?: string;
  rating: number;
  downloads: number;
  tags: string[];
  url: string;
  thumbnail?: string;
}

interface ResourceHubProps {
  user: { id: string; name: string; email: string; role: string };
}

export function ResourceHub({ user }: ResourceHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Mindfulness for Students',
      description: 'Learn practical mindfulness techniques to manage stress and improve focus during studies',
      type: 'video',
      category: 'mindfulness',
      language: 'English',
      duration: '15 min',
      rating: 4.8,
      downloads: 1250,
      tags: ['mindfulness', 'stress', 'meditation', 'focus'],
      url: '#',
      thumbnail: 'https://images.unsplash.com/photo-1655970580622-4a547789c850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMG1lZGl0YXRpb24lMjBzdHVkZW50c3xlbnwxfHx8fDE3NTc5MjgzMjZ8MA&ixlib=rb-4.1.0&q=80&w=300'
    },
    {
      id: '2',
      title: 'Deep Breathing Exercise',
      description: 'Guided breathing exercise to reduce anxiety and promote relaxation',
      type: 'audio',
      category: 'anxiety',
      language: 'Hindi',
      duration: '10 min',
      rating: 4.9,
      downloads: 890,
      tags: ['breathing', 'anxiety', 'relaxation'],
      url: '#'
    },
    {
      id: '3',
      title: 'Cognitive Behavioral Therapy Workbook',
      description: 'Comprehensive workbook with CBT techniques for managing depression and anxiety',
      type: 'pdf',
      category: 'therapy',
      language: 'English',
      rating: 4.7,
      downloads: 2100,
      tags: ['CBT', 'depression', 'anxiety', 'workbook'],
      url: '#'
    },
    {
      id: '4',
      title: 'Sleep Hygiene Guide',
      description: 'Essential tips and techniques for better sleep quality and mental health',
      type: 'article',
      category: 'sleep',
      language: 'Tamil',
      duration: '5 min read',
      rating: 4.6,
      downloads: 750,
      tags: ['sleep', 'hygiene', 'mental health'],
      url: '#'
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation',
      description: 'Audio guide for progressive muscle relaxation to reduce physical tension',
      type: 'audio',
      category: 'relaxation',
      language: 'Telugu',
      duration: '20 min',
      rating: 4.8,
      downloads: 620,
      tags: ['relaxation', 'muscle', 'tension'],
      url: '#'
    },
    {
      id: '6',
      title: 'Managing Academic Pressure',
      description: 'Video series on coping with academic stress and maintaining work-life balance',
      type: 'video',
      category: 'academic',
      language: 'Marathi',
      duration: '25 min',
      rating: 4.5,
      downloads: 980,
      tags: ['academic', 'pressure', 'balance'],
      url: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mindfulness', label: 'Mindfulness & Meditation' },
    { value: 'anxiety', label: 'Anxiety Management' },
    { value: 'depression', label: 'Depression Support' },
    { value: 'academic', label: 'Academic Stress' },
    { value: 'sleep', label: 'Sleep & Wellness' },
    { value: 'therapy', label: 'Therapy Resources' },
    { value: 'relaxation', label: 'Relaxation Techniques' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Gujarati', label: 'Gujarati' }
  ];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'pdf': return Download;
      case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'audio': return 'bg-green-100 text-green-600';
      case 'pdf': return 'bg-blue-100 text-blue-600';
      case 'article': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAudioPlay = (resourceId: string) => {
    if (currentAudio === resourceId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentAudio(resourceId);
      setIsPlaying(true);
    }
  };

  const resourcesByType = {
    videos: filteredResources.filter(r => r.type === 'video'),
    audios: filteredResources.filter(r => r.type === 'audio'),
    articles: filteredResources.filter(r => r.type === 'article' || r.type === 'pdf')
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-2">Resource Hub</h2>
        <p className="text-gray-600">
          Access mental wellness content in multiple regional languages
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(language => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredResources.length} resources found</span>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>{resourcesByType.videos.length} Videos</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Headphones className="h-3 w-3" />
              <span>{resourcesByType.audios.length} Audio</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{resourcesByType.articles.length} Articles</span>
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio Guides</TabsTrigger>
          <TabsTrigger value="articles">Articles & PDFs</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{resource.language}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center space-x-3">
                          {resource.duration && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{resource.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{resource.downloads}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {resource.type === 'audio' ? (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAudioPlay(resource.id)}
                          >
                            {currentAudio === resource.id && isPlaying ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Play
                              </>
                            )}
                          </Button>
                        ) : resource.type === 'video' ? (
                          <Button size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Watch
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesByType.videos.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                  {resource.thumbnail ? (
                    <ImageWithFallback 
                      src={resource.thumbnail} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-75">
                    {resource.duration}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="space-y-4">
            {resourcesByType.audios.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{resource.duration}</span>
                        <span>⭐ {resource.rating}</span>
                        <span>{resource.language}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAudioPlay(resource.id)}
                      className="px-6"
                    >
                      {currentAudio === resource.id && isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid md:grid-cols-2 gap-6">
            {resourcesByType.articles.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.type.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-3">
                        <span>⭐ {resource.rating}</span>
                        <span>↓ {resource.downloads}</span>
                        <span>{resource.language}</span>
                      </div>
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download {resource.type.toUpperCase()}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}