// src/utils/onboardingStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OnboardingData = {
  role: 'learner' | 'mentor';
  interests: string[];
  locationEnabled: boolean;
  paymentMethod?: 'mpesa' | 'card';
  phoneNumber?: string;
  completedAt: string;
};

const ONBOARDING_KEY = '@mentormatch_onboarding';
const ONBOARDING_COMPLETE_KEY = '@mentormatch_onboarding_complete';

/**
 * Save onboarding data to AsyncStorage
 */
export const saveOnboardingData = async (data: OnboardingData): Promise<void> => {
  try {
    const dataToSave = {
      ...data,
      completedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(dataToSave));
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
};

/**
 * Get saved onboarding data
 */
export const getOnboardingData = async (): Promise<OnboardingData | null> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    return null;
  }
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Clear onboarding data (for testing or logout)
 */
export const clearOnboardingData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
    throw error;
  }
};

/**
 * Update specific onboarding fields
 */
export const updateOnboardingData = async (
  updates: Partial<OnboardingData>
): Promise<void> => {
  try {
    const existingData = await getOnboardingData();
    if (existingData) {
      const updatedData = { ...existingData, ...updates };
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(updatedData));
    }
  } catch (error) {
    console.error('Error updating onboarding data:', error);
    throw error;
  }
};