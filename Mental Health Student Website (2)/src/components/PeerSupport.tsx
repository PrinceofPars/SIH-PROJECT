import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MessageCircle, 
  Users, 
  Heart, 
  ThumbsUp, 
  Reply, 
  Shield, 
  Clock,
  Plus,
  Search,
  AlertTriangle,
  User,
  RefreshCw,
  Flag,
  Ban
} from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Post {
  id: string;
  userId: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  timestamp: string;
  likes: number;
  replies: Reply[];
  isModerated: boolean;
  riskLevel?: string;
  flagged?: boolean;
}

interface Reply {
  id: string;
  userId: string;
  postId: string;
  content: string;
  isAnonymous: boolean;
  timestamp: string;
  likes: number;
  riskLevel?: string;
  flagged?: boolean;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  moderator: string;
  lastActivity: Date;
}

interface PeerSupportProps {
  user: { id: string; name: string; email: string; role: string };
}

export function PeerSupport({ user }: PeerSupportProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentError, setContentError] = useState("");
  const [page, setPage] = useState(1);

  // Load posts from server
  useEffect(() => {
    loadPosts();
    // Set up real-time updates
    const interval = setInterval(loadPosts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [page]);

  const loadPosts = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/peer-posts?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  // Mock groups data
  useEffect(() => {
    const mockGroups: SupportGroup[] = [
      {
        id: '1',
        name: 'Anxiety Support Circle',
        description: 'A safe space for students dealing with anxiety to share experiences and coping strategies',
        category: 'anxiety',
        memberCount: 89,
        isPrivate: false,
        moderator: 'Dr. Sarah Johnson',
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Academic Stress Warriors',
        description: 'Peer support for managing academic pressure and finding work-life balance',
        category: 'academic',
        memberCount: 156,
        isPrivate: false,
        moderator: 'Alex Chen',
        lastActivity: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '3',
        name: 'LGBTQ+ Mental Health',
        description: 'Supportive community for LGBTQ+ students focusing on mental wellness',
        category: 'identity',
        memberCount: 67,
        isPrivate: true,
        moderator: 'Jamie Rodriguez',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    setGroups(mockGroups);
  }, []);

  const categories = [
    { value: 'general', label: 'General Support' },
    { value: 'academic', label: 'Academic Stress' },
    { value: 'anxiety', label: 'Anxiety & Panic' },
    { value: 'depression', label: 'Depression Support' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'identity', label: 'Identity & Self' },
    { value: 'lifestyle', label: 'Lifestyle & Wellness' }
  ];

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setIsLoading(true);
    setContentError("");

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/peer-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user.id,
          content: newPost,
          category: selectedCategory,
          isAnonymous
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNewPost("");
        loadPosts(); // Refresh posts to show new post
      } else {
        setContentError(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setContentError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }

    // TODO: ML/DL INTEGRATION POINT FOR FORUM POSTS
    // The server endpoint '/peer-post' includes placeholder functions:
    // 1. `filterInappropriateContent()` - Basic content filtering that you can enhance
    // 2. `analyzePostRisk()` - Placeholder for your ML/DL risk assessment model
    // 
    // Replace these with your ML/DL models that should:
    // - Detect inappropriate content (18+ words, harassment, etc.)
    // - Analyze mental health risk indicators in posts
    // - Flag concerning content for moderator review
    // - Categorize emotional states and provide appropriate responses
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;

    setIsLoading(true);
    setContentError("");

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-93df8029/peer-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user.id,
          postId,
          content: replyContent,
          isAnonymous: false
        })
      });

      const data = await response.json();

      if (response.ok) {
        setReplyContent("");
        setReplyingTo(null);
        loadPosts(); // Refresh posts to show new reply
      } else {
        setContentError(data.error || "Failed to post reply");
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      setContentError("Failed to post reply. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    // Local state update for immediate feedback
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    // TODO: Implement server-side like functionality
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAuthorDisplay = (post: Post) => {
    if (post.isAnonymous || post.userId === 'anonymous') {
      return 'Anonymous Student';
    }
    // In a real app, you'd fetch user details from the server
    return 'Student';
  };

  const getAuthorInitials = (name: string) => {
    if (name === 'Anonymous Student') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'moderator': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'crisis': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-2">Peer Support Community</h2>
        <p className="text-gray-600">
          Connect with fellow students in a safe, moderated environment with real-time content filtering
        </p>
      </div>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Support Forum</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="volunteers">Peer Volunteers</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
              <CardDescription>
                Create a post to seek support or share your experience (Content is automatically filtered and monitored)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentError && (
                <Alert className="border-red-200 bg-red-50">
                  <Ban className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {contentError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <span>Post anonymously</span>
                </label>
              </div>
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, ask for advice, or offer support to others..."
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Auto-moderated for safety</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4" />
                    <span>Risk assessment enabled</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={!newPost.trim() || isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Refresh */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={loadPosts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-600 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Be the first to share something with the community!</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gray-200">
                              {getAuthorInitials(getAuthorDisplay(post))}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {getAuthorDisplay(post)}
                              </span>
                              <Badge variant="outline" className={`text-xs ${getRoleColor('student')}`}>
                                student
                              </Badge>
                              {post.isModerated && (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                  ✓ Moderated
                                </Badge>
                              )}
                              {post.riskLevel && post.riskLevel !== 'low' && (
                                <Badge variant="outline" className={`text-xs ${getRiskLevelColor(post.riskLevel)}`}>
                                  {post.riskLevel} risk
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(post.timestamp)}</span>
                              <span>•</span>
                              <span>{categories.find(c => c.value === post.category)?.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="text-gray-900">
                        {post.content}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center space-x-4 pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply ({post.replies.length})
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === post.id && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                          {contentError && (
                            <Alert className="border-red-200 bg-red-50">
                              <Ban className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                {contentError}
                              </AlertDescription>
                            </Alert>
                          )}
                          <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a supportive reply..."
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleReply(post.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Post Reply
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {post.replies.length > 0 && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gray-200 text-xs">
                                    {reply.isAnonymous ? '?' : 'S'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                      {reply.isAnonymous ? 'Anonymous' : 'Student'}
                                    </span>
                                    <Badge variant="outline" className={`text-xs ${getRoleColor('student')}`}>
                                      student
                                    </Badge>
                                    {reply.riskLevel && reply.riskLevel !== 'low' && (
                                      <Badge variant="outline" className={`text-xs ${getRiskLevelColor(reply.riskLevel)}`}>
                                        {reply.riskLevel} risk
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(reply.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-900 ml-11">
                                {reply.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.isPrivate && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Active {group.lastActivity.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>Moderated by {group.moderator}</span>
                    </div>
                    <Button className="w-full">
                      {group.isPrivate ? 'Request to Join' : 'Join Group'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex Chen',
                role: 'Senior Student Volunteer',
                specialties: ['Academic Stress', 'Time Management'],
                experience: '2 years',
                languages: ['English', 'Mandarin'],
                status: 'online'
              },
              {
                name: 'Maya Patel',
                role: 'Peer Support Specialist',
                specialties: ['Anxiety', 'Social Support'],
                experience: '1.5 years',
                languages: ['English', 'Hindi', 'Gujarati'],
                status: 'away'
              },
              {
                name: 'Jordan Smith',
                role: 'Crisis Response Volunteer',
                specialties: ['Crisis Support', 'Depression'],
                experience: '3 years',
                languages: ['English', 'Spanish'],
                status: 'online'
              }
            ].map((volunteer, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-100">
                          {getAuthorInitials(volunteer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{volunteer.name}</h3>
                        <p className="text-sm text-gray-600">{volunteer.role}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${
                            volunteer.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-xs text-gray-500 capitalize">{volunteer.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {volunteer.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience: </span>
                        <span>{volunteer.experience}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Languages: </span>
                        <span>{volunteer.languages.join(', ')}</span>
                      </div>
                    </div>

                    <Button className="w-full" disabled={volunteer.status !== 'online'}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {volunteer.status === 'online' ? 'Start Chat' : 'Currently Away'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Safety Notice */}
      <Card className="bg-yellow-50 border-yellow-200 mt-8">
        <CardContent className="p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <h4 className="text-yellow-900 mb-1">Community Guidelines & Safety</h4>
            <div className="text-yellow-800 space-y-1">
              <p>
                This is a supportive space with AI-powered content filtering and risk assessment. 
                Be kind, respectful, and maintain confidentiality.
              </p>
              <p>
                🤖 All posts are automatically screened for inappropriate content<br />
                🔍 Mental health risk indicators are monitored in real-time<br />
                👥 Human moderators review flagged content<br />
                🚨 Crisis situations trigger immediate intervention protocols
              </p>
              <p className="font-medium">
                If you're in crisis, please contact emergency services (911) or our crisis hotline (988) immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}