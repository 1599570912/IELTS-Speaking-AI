import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import { Platform, PermissionsAndroid } from 'react-native';
import { Recording, RecordingState } from '../types';

class AudioService {
  private audioRecorderPlayer: AudioRecorderPlayer;
  private recordingPath: string = '';

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1);
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  async startRecording(fileName: string): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Recording permission not granted');
    }

    const path = Platform.select({
      ios: `${fileName}.m4a`,
      android: `${this.audioRecorderPlayer.mmssss(Date.now())}.mp4`,
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    this.recordingPath = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    return this.recordingPath;
  }

  async stopRecording(): Promise<string> {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    return result;
  }

  async startPlayer(path: string): Promise<string> {
    return await this.audioRecorderPlayer.startPlayer(path);
  }

  async stopPlayer(): Promise<string> {
    return await this.audioRecorderPlayer.stopPlayer();
  }

  async pausePlayer(): Promise<string> {
    return await this.audioRecorderPlayer.pausePlayer();
  }

  async resumePlayer(): Promise<string> {
    return await this.audioRecorderPlayer.resumePlayer();
  }

  onRecorderStateChange(callback: (state: any) => void) {
    this.audioRecorderPlayer.addRecordBackListener(callback);
  }

  onPlayerStateChange(callback: (state: any) => void) {
    this.audioRecorderPlayer.addPlayBackListener(callback);
  }

  removeListeners() {
    this.audioRecorderPlayer.removeRecordBackListener();
    this.audioRecorderPlayer.removePlayBackListener();
  }

  mmssss(milisec: number): string {
    return this.audioRecorderPlayer.mmssss(milisec);
  }
}

export default new AudioService(); 