import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { IELTSCategory, Recording, RecordingState } from '../types';
import AudioService from '../services/AudioService';
import StorageService from '../services/StorageService';

const RecordingScreen: React.FC = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });

  const [selectedCategory, setSelectedCategory] = useState<IELTSCategory>(IELTSCategory.PRACTICE);
  const [recordingName, setRecordingName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentRecordingPath, setCurrentRecordingPath] = useState('');

  useEffect(() => {
    AudioService.onRecorderStateChange((e: any) => {
      setRecordingState(prev => ({
        ...prev,
        recordTime: AudioService.mmssss(Math.floor(e.currentPosition)),
        currentPositionSec: e.currentPosition,
      }));
    });

    return () => {
      AudioService.removeListeners();
    };
  }, []);

  const startRecording = async () => {
    try {
      const fileName = `recording_${Date.now()}`;
      const path = await AudioService.startRecording(fileName);
      setCurrentRecordingPath(path);
      setRecordingState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await AudioService.stopRecording();
      setRecordingState(prev => ({ 
        ...prev, 
        isRecording: false,
        recordTime: '00:00:00',
      }));
      setShowSaveModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
      console.error('Stop recording error:', error);
    }
  };

  const saveRecording = async () => {
    if (!recordingName.trim()) {
      Alert.alert('Error', 'Please enter a name for the recording');
      return;
    }

    try {
      const recording: Recording = {
        id: StorageService.generateId(),
        name: recordingName.trim(),
        category: selectedCategory,
        filePath: currentRecordingPath,
        duration: recordingState.currentPositionSec,
        createdAt: new Date(),
      };

      await StorageService.saveRecording(recording);
      setShowSaveModal(false);
      setRecordingName('');
      Alert.alert('Success', 'Recording saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save recording');
      console.error('Save recording error:', error);
    }
  };

  const cancelSave = () => {
    setShowSaveModal(false);
    setRecordingName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IELTS Speaking Practice</Text>
      
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Select Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.values(IELTSCategory).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recordingContainer}>
        <Text style={styles.timeDisplay}>{recordingState.recordTime}</Text>
        
        <TouchableOpacity
          style={[
            styles.recordButton,
            recordingState.isRecording && styles.recordingActive,
          ]}
          onPress={recordingState.isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {recordingState.isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelSave}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Recording</Text>
            
            <TextInput
              style={styles.nameInput}
              placeholder="Enter recording name"
              value={recordingName}
              onChangeText={setRecordingName}
              autoFocus={true}
            />
            
            <Text style={styles.categoryInfo}>
              Category: {selectedCategory}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelSave}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveRecording}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  categoryContainer: {
    marginBottom: 30,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  categoryButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  recordingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    fontFamily: 'monospace',
  },
  recordButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  categoryInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});

export default RecordingScreen; 