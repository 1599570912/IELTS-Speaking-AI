# 🎤 IELTS Speaking AI - 智能雅思口语练习应用

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-brightgreen.svg)](https://1599570912.github.io/IELTS-Speaking-AI/ielts-speaking-app-ai.html)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> 🤖 AI驱动的雅思口语练习应用 - 实时语音识别、智能评分、专业题库、历史记录管理

## ✨ 特色功能

### 🎯 核心功能
- **🎙️ 智能录音** - 高质量音频录制，支持多种格式
- **🗣️ 实时语音识别** - Web Speech API实时转录
- **🤖 AI智能评分** - 基于IELTS官方标准的四维评分
- **📚 专业题库** - 210+道真题，涵盖Part 1/2/3
- **📊 数据分析** - 详细的语音统计和改进建议
- **📝 历史记录** - 完整的练习记录和进度跟踪

### 🌟 技术亮点
- **无需安装** - 基于Web技术，浏览器直接使用
- **完全免费** - 开源项目，永久免费使用
- **隐私保护** - 所有数据本地存储，不上传服务器
- **跨平台** - 支持桌面、平板、手机多端使用
- **PWA支持** - 可安装为桌面应用
- **离线功能** - 基础录音功能支持离线使用

## 🚀 在线体验

### 📱 立即开始
**在线版本**: [https://1599570912.github.io/IELTS-Speaking-AI/ielts-speaking-app-ai.html](https://1599570912.github.io/IELTS-Speaking-AI/ielts-speaking-app-ai.html)

### 🖥️ 本地部署
```bash
# 克隆项目
git clone https://github.com/1599570912/IELTS-Speaking-AI.git

# 进入目录
cd IELTS-Speaking-AI

# 直接打开HTML文件
open ielts-speaking-app-ai.html
```

## 📋 功能演示

### 🎯 智能练习流程
```
选择类别 → 获取题目 → 开始录音 → 实时转录 → AI分析 → 查看报告 → 历史记录
```

### 📊 AI评分标准
| 评分维度 | 评分范围 | 考察要点 |
|----------|----------|----------|
| **流畅度** | 1-9分 | 语速、停顿、连接词使用 |
| **词汇** | 1-9分 | 词汇丰富度、准确性、适用性 |
| **语法** | 1-9分 | 语法复杂度、准确性 |
| **发音** | 1-9分 | 清晰度、音调变化 |

### 📚 题库内容
| 类别 | 话题数量 | 题目数量 | 特色功能 |
|------|----------|----------|----------|
| **Part 1** | 40+ | 120+ | 日常生活话题，3-4个相关问题 |
| **Part 2** | 30+ | 30+ | 描述类话题，包含详细要点 |
| **Part 3** | 20+ | 60+ | 抽象讨论，深度思考题目 |
| **Practice** | 全部 | 210+ | 综合练习，所有类别题目 |

## 🛠️ 技术架构

### 前端技术栈
- **HTML5** - 现代Web标准
- **CSS3** - 响应式设计和动画
- **JavaScript ES6+** - 现代JavaScript特性
- **Web APIs** - MediaRecorder、Speech Recognition、IndexedDB

### 核心模块
```
ielts-speaking-app-ai.html     # 主应用文件
├── speech-recognition-module.js  # 语音识别引擎
├── ielts-question-bank.js       # 题库系统
├── advanced-analysis-engine.js  # 进阶AI分析
├── manifest.json               # PWA配置
└── sw.js                      # Service Worker
```

### 数据存储
- **IndexedDB** - 本地数据库存储
- **localStorage** - 配置信息存储
- **Blob/Base64** - 音频数据格式

## 📖 详细文档

### 📚 使用指南
- [📋 完整使用说明](完整使用说明.md) - 详细的使用教程和学习策略
- [🎯 题库集成说明](题库集成说明.md) - 题库功能详细介绍
- [🚀 部署传播指南](部署传播指南.md) - 部署和分享方法

### 🔧 技术文档
- [🤖 AI版本使用说明](AI版本使用说明.md) - AI功能详细说明
- [🔧 AI版本修复说明](AI版本修复说明.md) - 问题解决方案
- [📈 功能增强路线图](功能增强路线图.md) - 未来发展规划

## 🎯 快速开始

### 1️⃣ 选择练习类别
从Part 1、Part 2、Part 3或Practice中选择适合的练习类别

### 2️⃣ 获取练习题目
- 🎲 **随机题目** - 系统随机选择题目
- 📚 **话题选择** - 选择特定话题练习

### 3️⃣ 开始录音练习
- 点击录音按钮开始练习
- 观察实时语音转录
- 根据题目要求自然回答

### 4️⃣ 查看AI分析
- 获得四维评分结果
- 查看详细改进建议
- 了解优势和薄弱环节

### 5️⃣ 管理历史记录
- 回顾练习历史
- 跟踪学习进度
- 重复薄弱话题练习

## 📊 项目统计

### 🎯 功能覆盖
- ✅ 录音功能
- ✅ 语音识别
- ✅ AI智能评分
- ✅ 题库系统
- ✅ 历史记录
- ✅ PWA支持
- ✅ 响应式设计
- ✅ 离线功能

### 📈 题库规模
- **总题目数**: 210+道
- **话题覆盖**: 90+个话题
- **类别支持**: Part 1/2/3 + Practice
- **答题技巧**: 每类别专业指导

## 🤝 贡献指南

### 🎯 如何贡献
我们欢迎各种形式的贡献：

- 🐛 **报告Bug** - 在Issues中提交问题
- 💡 **功能建议** - 提出新功能想法
- 📝 **文档改进** - 改善文档质量
- 🔧 **代码贡献** - 提交代码改进

### 📋 开发流程
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 🆘 技术支持

### 💬 获取帮助
- **GitHub Issues**: [提交问题](https://github.com/1599570912/IELTS-Speaking-AI/issues)
- **文档查阅**: 查看详细使用文档
- **在线演示**: 直接体验功能

### 🔧 常见问题
- **麦克风权限**: 确保浏览器允许麦克风访问
- **语音识别**: 在安静环境中使用，说话清晰
- **数据存储**: 所有数据本地存储，定期备份

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者和用户！

### 🌟 特别感谢
- Web Speech API 社区
- IELTS 官方评分标准
- 开源社区的支持

## 📞 联系我们

- **GitHub**: [@1599570912](https://github.com/1599570912)
- **项目主页**: [IELTS-Speaking-AI](https://github.com/1599570912/IELTS-Speaking-AI)
- **在线演示**: [Live Demo](https://1599570912.github.io/IELTS-Speaking-AI/ielts-speaking-app-ai.html)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！

🚀 立即开始您的IELTS口语提升之旅：[在线体验](https://1599570912.github.io/IELTS-Speaking-AI/ielts-speaking-app-ai.html)
