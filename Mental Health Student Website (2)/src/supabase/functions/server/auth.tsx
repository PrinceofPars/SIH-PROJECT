import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.tsx';

export async function createUserAccount(
  supabaseUrl: string, 
  serviceRoleKey: string, 
  userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    studentId?: string;
    department?: string;
    year?: string;
  }
) {
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: { 
        name: userData.name,
        role: userData.role
      },
      // Automatically confirm the user's email since email server hasn't been configured
      email_confirm: true
    });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    // Store additional user profile data in KV store
    const userProfile = {
      id: authData.user.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      studentId: userData.studentId || null,
      department: userData.department || null,
      year: userData.year || null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      settings: {
        notifications: true,
        language: 'English',
        theme: 'light'
      },
      mentalHealthProfile: {
        assessmentHistory: [],
        riskLevel: 'unknown',
        lastAssessment: null,
        preferences: {
          anonymousMode: false,
          shareWithPeers: true
        }
      }
    };

    // Store in KV store with user ID as key
    await kv.set(`user_profile:${authData.user.id}`, userProfile);

    // Initialize user statistics
    const userStats = {
      totalSessions: 0,
      totalAssessments: 0,
      lastActivity: new Date().toISOString(),
      streakDays: 0,
      resourcesAccessed: 0,
      peerInteractions: 0
    };

    await kv.set(`user_stats:${authData.user.id}`, userStats);

    // Add to role-based index for admin analytics
    const roleKey = `users_by_role:${userData.role}`;
    const existingUsers = await kv.get(roleKey) || [];
    existingUsers.push(authData.user.id);
    await kv.set(roleKey, existingUsers);

    // Add to department index if student
    if (userData.role === 'student' && userData.department) {
      const deptKey = `users_by_department:${userData.department}`;
      const deptUsers = await kv.get(deptKey) || [];
      deptUsers.push(authData.user.id);
      await kv.set(deptKey, deptUsers);
    }

    console.log(`Successfully created user account: ${userData.email}`);
    
    return {
      success: true,
      user: {
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    };

  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const profile = await kv.get(`user_profile:${userId}`);
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const existingProfile = await kv.get(`user_profile:${userId}`);
    if (!existingProfile) {
      throw new Error('User profile not found');
    }

    const updatedProfile = { ...existingProfile, ...updates };
    await kv.set(`user_profile:${userId}`, updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function recordUserActivity(userId: string, activity: string, metadata?: any) {
  try {
    // Update user stats
    const stats = await kv.get(`user_stats:${userId}`) || {
      totalSessions: 0,
      totalAssessments: 0,
      lastActivity: new Date().toISOString(),
      streakDays: 0,
      resourcesAccessed: 0,
      peerInteractions: 0
    };

    stats.lastActivity = new Date().toISOString();

    // Update specific counters based on activity type
    switch (activity) {
      case 'session_start':
        stats.totalSessions += 1;
        break;
      case 'assessment_complete':
        stats.totalAssessments += 1;
        break;
      case 'resource_access':
        stats.resourcesAccessed += 1;
        break;
      case 'peer_interaction':
        stats.peerInteractions += 1;
        break;
    }

    await kv.set(`user_stats:${userId}`, stats);

    // Store activity log for analytics
    const activityLog = {
      userId,
      activity,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    const activityKey = `activity_log:${new Date().toISOString().split('T')[0]}`;
    const dailyLogs = await kv.get(activityKey) || [];
    dailyLogs.push(activityLog);
    await kv.set(activityKey, dailyLogs);

    console.log(`Recorded activity for user ${userId}: ${activity}`);
    
  } catch (error) {
    console.error('Error recording user activity:', error);
  }
}

export async function validateUserAccess(authHeader: string, requiredRole?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  
  // This would typically validate the JWT token with Supabase
  // For now, we'll do a simple check
  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('Invalid token');
  }

  return { valid: true, userId: 'mock_user_id' };
}