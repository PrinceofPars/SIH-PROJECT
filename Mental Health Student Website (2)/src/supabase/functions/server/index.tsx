import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import * as kv from "./kv_store.tsx";
import { createUserAccount, getUserProfile, updateUserProfile, recordUserActivity } from './auth.tsx';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-93df8029/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post('/make-server-93df8029/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, studentId, department, year } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables');
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const result = await createUserAccount(supabaseUrl, serviceRoleKey, {
      email,
      password,
      name,
      role,
      studentId,
      department,
      year
    });

    return c.json(result);

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// User profile endpoints
app.get('/make-server-93df8029/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-93df8029/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const updatedProfile = await updateUserProfile(userId, updates);
    return c.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Activity tracking endpoint
app.post('/make-server-93df8029/activity', async (c) => {
  try {
    const { userId, activity, metadata } = await c.req.json();
    
    if (!userId || !activity) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    await recordUserActivity(userId, activity, metadata);
    return c.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// AI Chat endpoint with risk assessment
app.post('/make-server-93df8029/ai-chat', async (c) => {
  try {
    const { userId, message, sessionId } = await c.req.json();
    
    // TODO: Implement ML/DL risk assessment model here
    // This function should analyze the message content and return risk level
    // Expected output: 'low', 'moderate', 'high', 'crisis'
    const riskLevel = await analyzeMessageRisk(message); // Placeholder for ML implementation
    
    // Generate AI response (mock for now)
    const aiResponse = 'This is a mock AI response. In production, this would integrate with an AI service.';
    
    // Store chat interaction with risk assessment
    const chatLog = {
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      message,
      response: aiResponse,
      riskLevel,
      timestamp: new Date().toISOString(),
      needsIntervention: riskLevel === 'crisis'
    };

    const chatKey = `chat_log:${userId}:${new Date().toISOString().split('T')[0]}`;
    const existingLogs = await kv.get(chatKey) || [];
    existingLogs.push(chatLog);
    await kv.set(chatKey, existingLogs);

    // Real-time analytics update for admin dashboard
    await updateRiskAnalytics(userId, riskLevel);

    // Crisis intervention protocol
    if (riskLevel === 'crisis') {
      const interventionResult = await triggerCrisisIntervention(userId);
      await recordUserActivity(userId, 'crisis_intervention_triggered', { 
        riskLevel,
        autoBooking: interventionResult.autoBooking,
        appointmentId: interventionResult.appointmentId
      });
      
      return c.json({ 
        response: aiResponse,
        sessionId: chatLog.sessionId,
        riskLevel,
        crisis: true,
        intervention: interventionResult
      });
    }

    await recordUserActivity(userId, 'ai_chat_interaction', { sessionId, riskLevel });

    return c.json({ 
      response: aiResponse,
      sessionId: chatLog.sessionId,
      riskLevel
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Placeholder function for ML/DL risk assessment
async function analyzeMessageRisk(message: string): Promise<string> {
  // TODO: Implement your ML/DL model here
  // This should analyze the message content and return risk level
  // For now, return mock risk based on keywords (replace with actual ML implementation)
  
  const lowerMessage = message.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'no point living'];
  const highRiskKeywords = ['hopeless', 'worthless', 'can\'t go on', 'everything is wrong'];
  const moderateKeywords = ['stressed', 'anxious', 'worried', 'sad', 'depressed'];
  
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  } else if (highRiskKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'high';
  } else if (moderateKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'moderate';
  }
  
  return 'low';
}

// Update real-time risk analytics
async function updateRiskAnalytics(userId: string, riskLevel: string) {
  const today = new Date().toISOString().split('T')[0];
  const analyticsKey = `risk_analytics:${today}`;
  const analytics = await kv.get(analyticsKey) || { low: 0, moderate: 0, high: 0, crisis: 0 };
  
  analytics[riskLevel] = (analytics[riskLevel] || 0) + 1;
  await kv.set(analyticsKey, analytics);
}

// Crisis intervention and auto-booking
async function triggerCrisisIntervention(userId: string) {
  try {
    // Find next available counselor slot
    const availableSlot = await findNextAvailableSlot();
    
    if (availableSlot) {
      // Auto-book emergency appointment
      const emergencyBooking = {
        id: `emergency_${Date.now()}`,
        userId,
        counselorId: availableSlot.counselorId,
        date: availableSlot.date,
        time: availableSlot.time,
        sessionType: 'crisis_intervention',
        mode: 'video_call',
        notes: 'Auto-booked due to crisis detection in AI chat',
        status: 'emergency_scheduled',
        priority: 'urgent',
        createdAt: new Date().toISOString()
      };

      await kv.set(`booking:${emergencyBooking.id}`, emergencyBooking);
      
      // Add to user's bookings
      const userBookingsKey = `user_bookings:${userId}`;
      const userBookings = await kv.get(userBookingsKey) || [];
      userBookings.push(emergencyBooking.id);
      await kv.set(userBookingsKey, userBookings);

      return {
        autoBooking: true,
        appointmentId: emergencyBooking.id,
        appointment: emergencyBooking,
        message: 'Emergency appointment has been automatically scheduled. Please check your booking details.'
      };
    }

    return {
      autoBooking: false,
      message: 'Crisis detected. Please contact emergency services immediately or visit the nearest counseling center.'
    };
  } catch (error) {
    console.error('Crisis intervention error:', error);
    return {
      autoBooking: false,
      message: 'Crisis detected. Please seek immediate help from emergency services.'
    };
  }
}

// Find next available counselor slot (mock implementation)
async function findNextAvailableSlot() {
  // TODO: Implement actual slot availability logic
  // This is a mock implementation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    counselorId: 'counselor_1',
    date: tomorrow.toISOString().split('T')[0],
    time: '09:00',
    available: true
  };
}

// Assessment storage endpoint
app.post('/make-server-93df8029/assessment', async (c) => {
  try {
    const { userId, assessmentType, responses, score, riskLevel } = await c.req.json();
    
    const assessment = {
      id: `assessment_${Date.now()}`,
      userId,
      type: assessmentType,
      responses,
      score,
      riskLevel,
      timestamp: new Date().toISOString()
    };

    // Store assessment result
    const assessmentKey = `assessment:${userId}:${assessment.id}`;
    await kv.set(assessmentKey, assessment);

    // Update user profile with latest assessment
    const profile = await getUserProfile(userId);
    if (profile) {
      profile.mentalHealthProfile.lastAssessment = assessment;
      profile.mentalHealthProfile.riskLevel = riskLevel;
      profile.mentalHealthProfile.assessmentHistory.push({
        id: assessment.id,
        type: assessmentType,
        score,
        riskLevel,
        timestamp: assessment.timestamp
      });
      await updateUserProfile(userId, profile);
    }

    await recordUserActivity(userId, 'assessment_complete', { 
      assessmentType, 
      score, 
      riskLevel 
    });

    return c.json({ success: true, assessmentId: assessment.id });
  } catch (error) {
    console.error('Assessment storage error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Booking system endpoint
app.post('/make-server-93df8029/book-session', async (c) => {
  try {
    const { userId, counselorId, date, time, sessionType, mode, notes } = await c.req.json();
    
    const booking = {
      id: `booking_${Date.now()}`,
      userId,
      counselorId,
      date,
      time,
      sessionType,
      mode,
      notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    // Store booking
    const bookingKey = `booking:${booking.id}`;
    await kv.set(bookingKey, booking);

    // Add to user's bookings
    const userBookingsKey = `user_bookings:${userId}`;
    const userBookings = await kv.get(userBookingsKey) || [];
    userBookings.push(booking.id);
    await kv.set(userBookingsKey, userBookings);

    await recordUserActivity(userId, 'session_booked', { 
      counselorId, 
      sessionType, 
      mode 
    });

    return c.json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analytics endpoint for admin dashboard
app.get('/make-server-93df8029/analytics', async (c) => {
  try {
    // Get all user profiles to calculate analytics
    const allUsers = await kv.getByPrefix('user_profile:');
    const totalUsers = allUsers.length;

    // Calculate active users (users who logged in in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let activeUsers = 0;
    let riskDistribution = { low: 0, moderate: 0, high: 0, crisis: 0 };

    for (const user of allUsers) {
      if (user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo) {
        activeUsers++;
      }
      
      const riskLevel = user.mentalHealthProfile?.riskLevel || 'unknown';
      if (riskLevel in riskDistribution) {
        riskDistribution[riskLevel]++;
      }
    }

    // Get recent activity logs for session count
    const today = new Date().toISOString().split('T')[0];
    const activityLogs = await kv.get(`activity_log:${today}`) || [];
    const totalSessions = activityLogs.filter(log => log.activity === 'session_start').length;

    const analytics = {
      totalUsers,
      activeUsers,
      totalSessions,
      avgSessionDuration: 42, // Mock data
      crisisInterventions: activityLogs.filter(log => log.activity === 'crisis_intervention').length,
      completedAssessments: activityLogs.filter(log => log.activity === 'assessment_complete').length,
      riskDistribution: [
        { level: 'Low Risk', count: riskDistribution.low, color: '#10B981' },
        { level: 'Moderate Risk', count: riskDistribution.moderate, color: '#F59E0B' },
        { level: 'High Risk', count: riskDistribution.high, color: '#EF4444' },
        { level: 'Crisis', count: riskDistribution.crisis, color: '#7C2D12' }
      ]
    };

    return c.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Enhanced peer support endpoints with content filtering and risk analysis
app.post('/make-server-93df8029/peer-post', async (c) => {
  try {
    const { userId, content, category, isAnonymous } = await c.req.json();
    
    // Content filtering for 18+ words
    const filteredContent = await filterInappropriateContent(content);
    if (filteredContent.blocked) {
      return c.json({ 
        error: 'Content contains inappropriate language and cannot be posted',
        suggestion: 'Please revise your message and try again'
      }, 400);
    }

    // TODO: Implement ML/DL risk assessment for forum posts
    // This should analyze post content for mental health risk indicators
    const riskAnalysis = await analyzePostRisk(content); // Placeholder for ML implementation
    
    const post = {
      id: `post_${Date.now()}`,
      userId,
      content: filteredContent.content,
      category,
      isAnonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      isModerated: riskAnalysis.needsModeration,
      riskLevel: riskAnalysis.riskLevel,
      flagged: riskAnalysis.flagged
    };

    // Store post in database
    await kv.set(`peer_post:${post.id}`, post);

    // Add to category index
    const categoryKey = `posts_by_category:${category}`;
    const categoryPosts = await kv.get(categoryKey) || [];
    categoryPosts.push(post.id);
    await kv.set(categoryKey, categoryPosts);

    // Add to global posts list for real-time updates
    const allPostsKey = 'all_peer_posts';
    const allPosts = await kv.get(allPostsKey) || [];
    allPosts.unshift(post.id); // Add to beginning for latest first
    await kv.set(allPostsKey, allPosts.slice(0, 1000)); // Keep last 1000 posts

    // Update risk analytics if concerning content detected
    if (riskAnalysis.riskLevel !== 'low') {
      await updateRiskAnalytics(userId, riskAnalysis.riskLevel);
    }

    await recordUserActivity(userId, 'peer_post_created', { 
      category, 
      riskLevel: riskAnalysis.riskLevel 
    });

    return c.json({ success: true, post });
  } catch (error) {
    console.error('Peer post error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Post reply endpoint
app.post('/make-server-93df8029/peer-reply', async (c) => {
  try {
    const { userId, postId, content, isAnonymous } = await c.req.json();
    
    // Content filtering
    const filteredContent = await filterInappropriateContent(content);
    if (filteredContent.blocked) {
      return c.json({ 
        error: 'Reply contains inappropriate language and cannot be posted',
        suggestion: 'Please revise your message and try again'
      }, 400);
    }

    // Risk analysis for reply
    const riskAnalysis = await analyzePostRisk(content);
    
    const reply = {
      id: `reply_${Date.now()}`,
      userId,
      postId,
      content: filteredContent.content,
      isAnonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
      riskLevel: riskAnalysis.riskLevel,
      flagged: riskAnalysis.flagged
    };

    // Get original post and add reply
    const post = await kv.get(`peer_post:${postId}`);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    post.replies.push(reply);
    await kv.set(`peer_post:${postId}`, post);

    // Store reply separately for easy access
    await kv.set(`peer_reply:${reply.id}`, reply);

    await recordUserActivity(userId, 'peer_reply_created', { 
      postId, 
      riskLevel: riskAnalysis.riskLevel 
    });

    return c.json({ success: true, reply });
  } catch (error) {
    console.error('Peer reply error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all posts endpoint for real-time updates
app.get('/make-server-93df8029/peer-posts', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const category = c.req.query('category');

    let postIds;
    if (category) {
      postIds = await kv.get(`posts_by_category:${category}`) || [];
    } else {
      postIds = await kv.get('all_peer_posts') || [];
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedIds = postIds.slice(startIndex, startIndex + limit);

    // Get post details
    const posts = [];
    for (const postId of paginatedIds) {
      const post = await kv.get(`peer_post:${postId}`);
      if (post && !post.flagged) { // Don't show flagged posts
        // Remove sensitive user info for anonymous posts
        if (post.isAnonymous) {
          post.userId = 'anonymous';
        }
        posts.push(post);
      }
    }

    return c.json({ 
      posts, 
      pagination: {
        page,
        limit,
        total: postIds.length,
        hasMore: startIndex + limit < postIds.length
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Content filtering function
async function filterInappropriateContent(content: string) {
  // Basic inappropriate content filter
  const inappropriateWords = [
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard',
    // Add more inappropriate words as needed
  ];
  
  const lowerContent = content.toLowerCase();
  const hasInappropriate = inappropriateWords.some(word => 
    lowerContent.includes(word)
  );

  if (hasInappropriate) {
    return {
      blocked: true,
      content: content,
      reason: 'Contains inappropriate language'
    };
  }

  return {
    blocked: false,
    content: content
  };
}

// Risk analysis for forum posts
async function analyzePostRisk(content: string) {
  // TODO: Implement your ML/DL model for forum post risk analysis here
  // This should analyze post content for mental health risk indicators
  
  const lowerContent = content.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'no hope'];
  const highRiskKeywords = ['hopeless', 'worthless', 'nobody cares', 'give up'];
  const moderateKeywords = ['struggling', 'difficult time', 'overwhelmed', 'stressed'];
  
  let riskLevel = 'low';
  let needsModeration = false;
  let flagged = false;

  if (crisisKeywords.some(keyword => lowerContent.includes(keyword))) {
    riskLevel = 'crisis';
    needsModeration = true;
    flagged = true;
  } else if (highRiskKeywords.some(keyword => lowerContent.includes(keyword))) {
    riskLevel = 'high';
    needsModeration = true;
  } else if (moderateKeywords.some(keyword => lowerContent.includes(keyword))) {
    riskLevel = 'moderate';
  }

  return {
    riskLevel,
    needsModeration,
    flagged
  };
}

// Resource suggestions based on problem type
app.post('/make-server-93df8029/get-resources', async (c) => {
  try {
    const { problemType, riskLevel } = await c.req.json();
    
    const resources = generateResourceSuggestions(problemType, riskLevel);
    
    return c.json({ resources });
  } catch (error) {
    console.error('Resource suggestion error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Generate relevant resource suggestions
function generateResourceSuggestions(problemType: string, riskLevel: string) {
  const baseResources = {
    anxiety: {
      videos: [
        {
          title: "Anxiety Management Techniques",
          url: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
          description: "Learn practical techniques to manage anxiety"
        },
        {
          title: "Breathing Exercises for Anxiety",
          url: "https://www.youtube.com/watch?v=Luxo9jJM0Tc",
          description: "Simple breathing exercises to reduce anxiety"
        }
      ],
      books: [
        {
          title: "The Anxiety and Worry Workbook",
          author: "David A. Clark",
          url: "https://www.amazon.com/Anxiety-Worry-Workbook-Cognitive-Behavioral/dp/1462546021",
          description: "CBT-based strategies for managing anxiety"
        }
      ],
      articles: [
        {
          title: "Understanding Anxiety Disorders",
          url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
          description: "Comprehensive guide to anxiety disorders"
        }
      ]
    },
    depression: {
      videos: [
        {
          title: "Overcoming Depression",
          url: "https://www.youtube.com/watch?v=XiCrniLQGYc",
          description: "Understanding and overcoming depression"
        },
        {
          title: "Depression: What You Need to Know",
          url: "https://www.youtube.com/watch?v=z-IR48Mb3W0",
          description: "Educational video about depression"
        }
      ],
      books: [
        {
          title: "Feeling Good: The New Mood Therapy",
          author: "David D. Burns",
          url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336",
          description: "Classic book on cognitive behavioral therapy for depression"
        }
      ],
      articles: [
        {
          title: "Depression Basics",
          url: "https://www.nimh.nih.gov/health/topics/depression",
          description: "Understanding depression and treatment options"
        }
      ]
    },
    stress: {
      videos: [
        {
          title: "Stress Management Techniques",
          url: "https://www.youtube.com/watch?v=PDBJLGckt7E",
          description: "Effective stress management strategies"
        },
        {
          title: "Mindfulness for Stress Relief",
          url: "https://www.youtube.com/watch?v=inpok4MKVLM",
          description: "Using mindfulness to manage stress"
        }
      ],
      books: [
        {
          title: "The Stress-Free Life",
          author: "Fred Luskin",
          url: "https://www.amazon.com/Stress-Free-Life-Powerful-Techniques-Prevent/dp/0807071005",
          description: "Practical techniques for stress management"
        }
      ],
      articles: [
        {
          title: "Stress Management",
          url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/basics/stress-basics/hlv-20049495",
          description: "Comprehensive guide to managing stress"
        }
      ]
    },
    general: {
      videos: [
        {
          title: "Mental Health Awareness",
          url: "https://www.youtube.com/watch?v=DxIDKZHW3-E",
          description: "General mental health awareness and tips"
        }
      ],
      books: [
        {
          title: "The Mental Health Handbook",
          author: "Various Authors",
          url: "https://www.amazon.com/Mental-Health-Handbook-Cognitive-Behavioral/dp/1684034685",
          description: "Comprehensive mental health resource"
        }
      ],
      articles: [
        {
          title: "Mental Health Information",
          url: "https://www.nimh.nih.gov/health/topics",
          description: "Comprehensive mental health information"
        }
      ]
    }
  };

  // Get relevant resources based on problem type
  let relevantResources = baseResources[problemType] || baseResources.general;

  // Add crisis-specific resources if high risk
  if (riskLevel === 'crisis' || riskLevel === 'high') {
    relevantResources = {
      ...relevantResources,
      crisis: [
        {
          title: "Crisis Text Line",
          description: "Text HOME to 741741 for free, 24/7 crisis support",
          type: "hotline"
        },
        {
          title: "National Suicide Prevention Lifeline",
          description: "Call 988 for immediate help",
          type: "hotline"
        }
      ]
    };
  }

  return relevantResources;
}

Deno.serve(app.fetch);