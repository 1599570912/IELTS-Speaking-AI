# IELTS Speaking App 开发和运行指南

## 项目概述
这是一个基于 React Native 的 IELTS 口语练习应用，支持录音、播放和分类存储功能。

## 已安装的依赖包
- `react-native-audio-recorder-player` - 音频录制和播放
- `@react-native-async-storage/async-storage` - 本地数据存储
- `react-native-permissions` - 权限管理
- `@react-navigation/native` - 导航框架
- `@react-navigation/bottom-tabs` - 底部标签导航
- `react-native-screens` - 屏幕管理
- `react-native-safe-area-context` - 安全区域处理

## 项目结构
```
src/
├── types/
│   └── index.ts              # TypeScript 类型定义
├── services/
│   ├── AudioService.ts       # 音频录制播放服务
│   └── StorageService.ts     # 数据存储服务
└── components/
    ├── RecordingScreen.tsx   # 录音界面
    └── RecordingsListScreen.tsx # 录音列表界面
```

## 运行应用

### 1. 启动 Metro 服务器
```bash
npm start
# 或
npx react-native start
```

### 2. 运行 Android 版本
```bash
npm run android
# 或
npx react-native run-android
```

### 3. 运行 iOS 版本
首先需要安装 CocoaPods 依赖：
```bash
cd ios
pod install  # 如果有 CocoaPods
cd ..
```

然后运行：
```bash
npm run ios
# 或
npx react-native run-ios
```

## 权限配置

### Android 权限
已在 `android/app/src/main/AndroidManifest.xml` 中添加：
- `RECORD_AUDIO` - 录音权限
- `WRITE_EXTERNAL_STORAGE` - 写入存储权限
- `READ_EXTERNAL_STORAGE` - 读取存储权限

### iOS 权限
已在 `ios/IELTSSpeakingApp/Info.plist` 中添加：
- `NSMicrophoneUsageDescription` - 麦克风使用说明

## 功能特性

### 录音功能
- 高质量 AAC 格式录音
- 实时录音时长显示
- 录音权限自动请求
- 录音文件自动命名

### 分类管理
- Part 1 - Introduction
- Part 2 - Individual Long Turn  
- Part 3 - Two-way Discussion
- Practice

### 播放功能
- 音频播放控制
- 播放进度显示
- 播放状态管理

### 数据存储
- 使用 AsyncStorage 本地存储
- 录音元数据管理
- 分类筛选功能

## 开发注意事项

### 1. 权限处理
应用会在首次录音时自动请求麦克风权限，确保用户授权后才能正常录音。

### 2. 文件路径
录音文件保存在应用的私有目录中，iOS 和 Android 的路径处理略有不同。

### 3. 状态管理
使用 React Hooks 管理录音状态、播放状态和数据状态。

### 4. 错误处理
所有音频操作都包含错误处理，会向用户显示友好的错误信息。

## 故障排除

### 常见问题
1. **录音无声音**：检查麦克风权限是否已授权
2. **播放失败**：确认录音文件路径正确
3. **应用崩溃**：检查设备存储空间是否充足
4. **权限被拒绝**：需要用户手动在设置中开启权限

### 调试建议
1. 使用 `npx react-native log-android` 查看 Android 日志
2. 使用 `npx react-native log-ios` 查看 iOS 日志
3. 在代码中添加 console.log 进行调试

## 下一步开发建议

### 可能的功能扩展
1. **录音质量设置**：允许用户选择录音质量
2. **录音重命名**：支持录音后重命名
3. **导出功能**：支持将录音导出到其他应用
4. **练习统计**：显示练习时长统计
5. **题目提示**：内置 IELTS 口语题目
6. **语音评估**：集成语音识别和评分功能

### 性能优化
1. **懒加载**：大量录音时的列表优化
2. **缓存管理**：音频文件缓存策略
3. **内存管理**：长时间录音的内存优化

---

应用已经具备了基本的录音、播放和管理功能，可以满足个人 IELTS 口语练习的需求。 