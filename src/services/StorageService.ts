import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recording, IELTSCategory } from '../types';

const RECORDINGS_KEY = 'ielts_recordings';

class StorageService {
  async saveRecording(recording: Recording): Promise<void> {
    try {
      const recordings = await this.getAllRecordings();
      recordings.push(recording);
      await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(recordings));
    } catch (error) {
      console.error('Error saving recording:', error);
      throw error;
    }
  }

  async getAllRecordings(): Promise<Recording[]> {
    try {
      const recordingsJson = await AsyncStorage.getItem(RECORDINGS_KEY);
      if (recordingsJson) {
        const recordings = JSON.parse(recordingsJson);
        // Convert date strings back to Date objects
        return recordings.map((recording: any) => ({
          ...recording,
          createdAt: new Date(recording.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting recordings:', error);
      return [];
    }
  }

  async getRecordingsByCategory(category: IELTSCategory): Promise<Recording[]> {
    try {
      const allRecordings = await this.getAllRecordings();
      return allRecordings.filter(recording => recording.category === category);
    } catch (error) {
      console.error('Error getting recordings by category:', error);
      return [];
    }
  }

  async deleteRecording(id: string): Promise<void> {
    try {
      const recordings = await this.getAllRecordings();
      const filteredRecordings = recordings.filter(recording => recording.id !== id);
      await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(filteredRecordings));
    } catch (error) {
      console.error('Error deleting recording:', error);
      throw error;
    }
  }

  async updateRecording(id: string, updates: Partial<Recording>): Promise<void> {
    try {
      const recordings = await this.getAllRecordings();
      const recordingIndex = recordings.findIndex(recording => recording.id === id);
      
      if (recordingIndex !== -1) {
        recordings[recordingIndex] = { ...recordings[recordingIndex], ...updates };
        await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(recordings));
      }
    } catch (error) {
      console.error('Error updating recording:', error);
      throw error;
    }
  }

  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export default new StorageService(); 