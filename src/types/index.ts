export interface Recording {
  id: string;
  name: string;
  category: IELTSCategory;
  filePath: string;
  duration: number;
  createdAt: Date;
}

export enum IELTSCategory {
  PART1 = 'Part 1 - Introduction',
  PART2 = 'Part 2 - Individual Long Turn',
  PART3 = 'Part 3 - Two-way Discussion',
  PRACTICE = 'Practice',
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
} 