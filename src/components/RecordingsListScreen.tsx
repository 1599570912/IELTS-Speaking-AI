import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Recording, IELTSCategory } from '../types';
import StorageService from '../services/StorageService';
import AudioService from '../services/AudioService';

const RecordingsListScreen: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IELTSCategory | 'ALL'>('ALL');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [playbackState, setPlaybackState] = useState({
    currentTime: '00:00:00',
    duration: '00:00:00',
  });

  const loadRecordings = useCallback(async () => {
    try {
      let loadedRecordings: Recording[];
      if (selectedCategory === 'ALL') {
        loadedRecordings = await StorageService.getAllRecordings();
      } else {
        loadedRecordings = await StorageService.getRecordingsByCategory(selectedCategory);
      }
      // Sort by creation date (newest first)
      loadedRecordings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecordings(loadedRecordings);
    } catch (error) {
      console.error('Error loading recordings:', error);
      Alert.alert('Error', 'Failed to load recordings');
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  useEffect(() => {
    AudioService.onPlayerStateChange((e: any) => {
      setPlaybackState({
        currentTime: AudioService.mmssss(Math.floor(e.currentPosition)),
        duration: AudioService.mmssss(Math.floor(e.duration)),
      });
    });

    return () => {
      AudioService.removeListeners();
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecordings();
    setRefreshing(false);
  }, [loadRecordings]);

  const playRecording = async (recording: Recording) => {
    try {
      if (currentlyPlaying === recording.id) {
        await AudioService.stopPlayer();
        setCurrentlyPlaying(null);
      } else {
        if (currentlyPlaying) {
          await AudioService.stopPlayer();
        }
        await AudioService.startPlayer(recording.filePath);
        setCurrentlyPlaying(recording.id);
      }
    } catch (error) {
      console.error('Error playing recording:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const deleteRecording = (recording: Recording) => {
    Alert.alert(
      'Delete Recording',
      `Are you sure you want to delete "${recording.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (currentlyPlaying === recording.id) {
                await AudioService.stopPlayer();
                setCurrentlyPlaying(null);
              }
              await StorageService.deleteRecording(recording.id);
              await loadRecordings();
            } catch (error) {
              console.error('Error deleting recording:', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (durationMs: number) => {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderRecordingItem = ({ item }: { item: Recording }) => (
    <View style={styles.recordingItem}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName}>{item.name}</Text>
        <Text style={styles.recordingCategory}>{item.category}</Text>
        <Text style={styles.recordingDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.recordingDuration}>Duration: {formatDuration(item.duration)}</Text>
        {currentlyPlaying === item.id && (
          <Text style={styles.playbackTime}>
            {playbackState.currentTime} / {playbackState.duration}
          </Text>
        )}
      </View>
      
      <View style={styles.recordingActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.playButton,
            currentlyPlaying === item.id && styles.stopButton,
          ]}
          onPress={() => playRecording(item)}
        >
          <Text style={styles.actionButtonText}>
            {currentlyPlaying === item.id ? 'Stop' : 'Play'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteRecording(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const categories = ['ALL', ...Object.values(IELTSCategory)];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Recordings</Text>
      
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === item && styles.selectedFilter,
              ]}
              onPress={() => setSelectedCategory(item as IELTSCategory | 'ALL')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === item && styles.selectedFilterText,
                ]}
              >
                {item === 'ALL' ? 'All' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {recordings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recordings found</Text>
          <Text style={styles.emptySubtext}>
            {selectedCategory === 'ALL' 
              ? 'Start recording to see your practice sessions here'
              : `No recordings in ${selectedCategory} category`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          renderItem={renderRecordingItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    marginBottom: 20,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  recordingItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  recordingInfo: {
    flex: 1,
    marginBottom: 10,
  },
  recordingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordingCategory: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  recordingDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  recordingDuration: {
    fontSize: 12,
    color: '#666',
  },
  playbackTime: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 5,
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  playButton: {
    backgroundColor: '#007AFF',
  },
  stopButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default RecordingsListScreen; 