// 语音识别和AI分析模块
class SpeechAnalysisEngine {
    constructor() {
        this.recognition = null;
        this.isRecognizing = false;
        this.transcript = '';
        this.interimTranscript = '';
        this.finalTranscript = '';
        this.startTime = null;
        this.endTime = null;
        this.pauseCount = 0;
        this.lastSpeechTime = null;
        this.shouldContinue = false; // 控制是否应该继续识别
        
        this.initSpeechRecognition();
    }

    // 初始化语音识别
    initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('浏览器不支持语音识别');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // 配置语音识别
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;

        // 设置事件监听器
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            console.log('语音识别开始');
            this.isRecognizing = true;
            this.startTime = Date.now();
            this.transcript = '';
            this.pauseCount = 0;
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            
            // 累积所有最终结果
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    // 累积最终转录文本，避免重复
                    this.finalTranscript += transcript;
                    this.lastSpeechTime = Date.now();
                    console.log('新增最终文本:', transcript);
                } else {
                    // 临时转录文本
                    interimTranscript += transcript;
                }
            }

            // 更新完整转录文本
            this.transcript = this.finalTranscript + interimTranscript;
            this.interimTranscript = interimTranscript;
            
            console.log('当前完整文本长度:', this.transcript.length);
            this.onTranscriptUpdate?.(this.finalTranscript, interimTranscript);
        };

        this.recognition.onend = () => {
            console.log('语音识别结束');
            this.isRecognizing = false;
            
            // 如果录音还在进行中，自动重启语音识别以保持连续性
            if (this.shouldContinue) {
                console.log('自动重启语音识别以保持连续性');
                setTimeout(() => {
                    if (this.shouldContinue) {
                        this.startRecognition();
                    }
                }, 100);
            } else {
                this.endTime = Date.now();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('语音识别错误:', event.error);
        };

        this.recognition.onspeechstart = () => {
            console.log('检测到语音输入');
        };

        this.recognition.onspeechend = () => {
            console.log('语音输入结束');
        };

        this.recognition.onnomatch = () => {
            console.log('未识别到语音');
        };
    }

    // 开始语音识别
    startRecognition() {
        if (this.recognition && !this.isRecognizing) {
            try {
                this.shouldContinue = true;
                this.recognition.start();
                return true;
            } catch (error) {
                console.error('启动语音识别失败:', error);
                return false;
            }
        }
        return false;
    }

    // 停止语音识别
    stopRecognition() {
        this.shouldContinue = false; // 停止自动重启
        if (this.recognition && this.isRecognizing) {
            this.recognition.stop();
        }
    }

    // 获取转录文本
    getTranscript() {
        return {
            final: this.finalTranscript,
            interim: this.interimTranscript,
            full: this.transcript
        };
    }

    // 计算语音统计
    calculateSpeechStats() {
        const duration = this.endTime ? (this.endTime - this.startTime) : (Date.now() - this.startTime);
        const transcript = this.finalTranscript || this.transcript || '';
        const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const wpm = duration > 0 ? Math.round((wordCount / duration) * 60000) : 0; // 每分钟词数

        return {
            duration: duration,
            wordCount: wordCount,
            wpm: wpm,
            transcript: transcript,
            pauseCount: this.pauseCount || 0
        };
    }
}

// AI分析引擎
class AIAnalysisEngine {
    constructor() {
        this.analysisCache = new Map();
    }

    // 综合分析录音
    async analyzeRecording(speechStats, category = 'Practice') {
        const analysis = {
            overall: 0,
            fluency: this.analyzeFluency(speechStats),
            vocabulary: this.analyzeVocabulary(speechStats),
            grammar: this.analyzeGrammar(speechStats),
            pronunciation: this.analyzePronunciation(speechStats),
            content: this.analyzeContent(speechStats, category),
            feedback: [],
            strengths: [],
            improvements: []
        };

        // 计算总分
        analysis.overall = this.calculateOverallScore(analysis);
        
        // 生成反馈
        analysis.feedback = this.generateFeedback(analysis);
        analysis.strengths = this.identifyStrengths(analysis);
        analysis.improvements = this.suggestImprovements(analysis);

        return analysis;
    }

    // 流畅度分析
    analyzeFluency(stats) {
        const { duration, wordCount, wpm, pauseCount } = stats;
        
        let score = 5.0; // 基础分
        
        // 处理无效数据
        if (!duration || duration <= 0 || !wordCount || wordCount <= 0) {
            return {
                score: 1.0,
                wpm: 0,
                pauseRate: 0,
                feedback: '录音时间过短或无有效语音内容'
            };
        }
        
        // 语速评分 (理想范围: 130-160 WPM)
        if (wpm >= 130 && wpm <= 160) {
            score += 1.5;
        } else if (wpm >= 110 && wpm <= 180) {
            score += 1.0;
        } else if (wpm >= 90 && wpm <= 200) {
            score += 0.5;
        }

        // 停顿评分
        const pauseRate = pauseCount / (duration / 1000); // 每秒停顿次数
        if (pauseRate < 0.1) {
            score += 1.0;
        } else if (pauseRate < 0.2) {
            score += 0.5;
        }

        // 录音时长合理性
        if (duration >= 30000 && duration <= 180000) { // 30秒-3分钟
            score += 0.5;
        }

        return {
            score: Math.min(9.0, Math.max(1.0, score)),
            wpm: wpm,
            pauseRate: pauseRate,
            details: {
                speechRate: wpm >= 130 && wpm <= 160 ? 'appropriate' : wpm < 130 ? 'slow' : 'fast',
                pauseFrequency: pauseRate < 0.1 ? 'natural' : 'frequent',
                duration: this.formatDuration(duration)
            }
        };
    }

    // 词汇分析
    analyzeVocabulary(stats) {
        const transcript = stats.transcript || '';
        if (!transcript.trim()) {
            return {
                score: 1.0,
                diversity: 0,
                uniqueWords: 0,
                totalWords: 0,
                advancedWords: [],
                repetition: 0,
                details: {
                    range: 'no content',
                    sophistication: 'no content'
                }
            };
        }
        
        const words = transcript.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
        const uniqueWords = new Set(words.map(word => word.replace(/[^\w]/g, '')));
        const vocabulary = Array.from(uniqueWords).filter(word => word.length > 0);
        
        let score = 5.0;
        
        // 词汇多样性
        const lexicalDiversity = words.length > 0 ? vocabulary.length / words.length : 0;
        if (lexicalDiversity > 0.7) {
            score += 2.0;
        } else if (lexicalDiversity > 0.5) {
            score += 1.5;
        } else if (lexicalDiversity > 0.3) {
            score += 1.0;
        }

        // 高级词汇检测
        const advancedWords = this.detectAdvancedVocabulary(vocabulary);
        score += Math.min(1.5, advancedWords.length * 0.1);

        // 重复词汇检测
        const repetition = this.calculateRepetition(words);
        if (repetition < 0.1) {
            score += 0.5;
        }

        return {
            score: Math.min(9.0, Math.max(1.0, score)),
            diversity: lexicalDiversity,
            uniqueWords: vocabulary.length,
            totalWords: words.length,
            advancedWords: advancedWords,
            repetition: repetition,
            details: {
                range: vocabulary.length > 50 ? 'wide' : vocabulary.length > 30 ? 'adequate' : 'limited',
                sophistication: advancedWords.length > 5 ? 'advanced' : advancedWords.length > 2 ? 'intermediate' : 'basic'
            }
        };
    }

    // 语法分析
    analyzeGrammar(stats) {
        const transcript = stats.transcript || '';
        if (!transcript.trim()) {
            return {
                score: 1.0,
                sentenceCount: 0,
                avgSentenceLength: 0,
                complexStructures: [],
                errors: [],
                details: {
                    complexity: 'no content',
                    accuracy: 'no content'
                }
            };
        }
        
        const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        let score = 5.0;
        
        // 句子结构多样性
        const avgSentenceLength = sentences.length > 0 ? stats.wordCount / sentences.length : 0;
        if (avgSentenceLength >= 10 && avgSentenceLength <= 20) {
            score += 1.5;
        } else if (avgSentenceLength >= 8 && avgSentenceLength <= 25) {
            score += 1.0;
        }

        // 复杂句型检测
        const complexSentences = this.detectComplexStructures(transcript);
        score += Math.min(1.5, complexSentences.length * 0.2);

        // 语法错误检测 (简单规则)
        const errors = this.detectGrammarErrors(transcript);
        score -= Math.min(2.0, errors.length * 0.1);

        return {
            score: Math.min(9.0, Math.max(1.0, score)),
            sentenceCount: sentences.length,
            avgSentenceLength: avgSentenceLength,
            complexStructures: complexSentences,
            errors: errors,
            details: {
                complexity: complexSentences.length > 3 ? 'varied' : 'simple',
                accuracy: errors.length < 3 ? 'accurate' : 'some errors'
            }
        };
    }

    // 发音分析 (基于语音识别置信度)
    analyzePronunciation(stats) {
        let score = 6.5; // 基础分，因为语音识别成功说明发音相对清晰
        
        // 基于转录成功率估算发音清晰度
        const transcriptLength = stats.transcript.length;
        if (transcriptLength > stats.wordCount * 4) { // 平均每词4字符以上
            score += 1.0;
        }

        // 检测可能的发音问题词汇
        const problemWords = this.detectPronunciationIssues(stats.transcript);
        score -= Math.min(1.5, problemWords.length * 0.1);

        return {
            score: Math.min(9.0, Math.max(1.0, score)),
            clarity: transcriptLength > stats.wordCount * 4 ? 'clear' : 'adequate',
            problemWords: problemWords,
            details: {
                clarity: 'generally clear',
                stress: 'appropriate',
                intonation: 'natural'
            }
        };
    }

    // 内容分析
    analyzeContent(stats, category) {
        let score = 5.0;
        
        // 内容长度适中性
        if (stats.wordCount >= 100 && stats.wordCount <= 300) {
            score += 1.5;
        } else if (stats.wordCount >= 50 && stats.wordCount <= 400) {
            score += 1.0;
        }

        // 话题相关性 (基于关键词)
        const relevantKeywords = this.analyzeTopicRelevance(stats.transcript, category);
        score += Math.min(1.5, relevantKeywords.length * 0.1);

        // 逻辑连接词
        const connectors = this.detectLogicalConnectors(stats.transcript);
        score += Math.min(1.0, connectors.length * 0.1);

        return {
            score: Math.min(9.0, Math.max(1.0, score)),
            wordCount: stats.wordCount,
            relevantKeywords: relevantKeywords,
            logicalConnectors: connectors,
            details: {
                length: stats.wordCount >= 100 ? 'appropriate' : 'brief',
                relevance: relevantKeywords.length > 3 ? 'highly relevant' : 'somewhat relevant',
                coherence: connectors.length > 2 ? 'well-structured' : 'basic structure'
            }
        };
    }

    // 计算总分
    calculateOverallScore(analysis) {
        const weights = {
            fluency: 0.25,
            vocabulary: 0.25,
            grammar: 0.25,
            pronunciation: 0.25
        };

        return (
            analysis.fluency.score * weights.fluency +
            analysis.vocabulary.score * weights.vocabulary +
            analysis.grammar.score * weights.grammar +
            analysis.pronunciation.score * weights.pronunciation
        );
    }

    // 生成反馈
    generateFeedback(analysis) {
        const feedback = [];
        
        if (analysis.fluency.score < 6.0) {
            feedback.push({
                type: 'fluency',
                message: '建议多练习连续说话，减少不必要的停顿',
                priority: 'high'
            });
        }
        
        if (analysis.vocabulary.score < 6.0) {
            feedback.push({
                type: 'vocabulary',
                message: '尝试使用更多样化的词汇，避免重复使用相同的词',
                priority: 'medium'
            });
        }
        
        if (analysis.grammar.score < 6.0) {
            feedback.push({
                type: 'grammar',
                message: '注意使用更复杂的句型结构，检查语法准确性',
                priority: 'high'
            });
        }

        return feedback;
    }

    // 识别优势
    identifyStrengths(analysis) {
        const strengths = [];
        
        if (analysis.fluency.score >= 7.0) {
            strengths.push('语速流畅，停顿自然');
        }
        
        if (analysis.vocabulary.score >= 7.0) {
            strengths.push('词汇使用多样化');
        }
        
        if (analysis.grammar.score >= 7.0) {
            strengths.push('语法结构运用良好');
        }
        
        if (analysis.pronunciation.score >= 7.0) {
            strengths.push('发音清晰易懂');
        }

        return strengths;
    }

    // 改进建议
    suggestImprovements(analysis) {
        const improvements = [];
        
        if (analysis.fluency.score < 7.0) {
            improvements.push({
                area: '流畅度',
                suggestion: '多进行影子跟读练习，提高连续表达能力',
                exercises: ['影子跟读', '计时演讲练习', '录音回听']
            });
        }
        
        if (analysis.vocabulary.score < 7.0) {
            improvements.push({
                area: '词汇',
                suggestion: '扩大词汇量，学习话题相关的高级词汇',
                exercises: ['主题词汇学习', '同义词替换练习', '词汇搭配练习']
            });
        }
        
        if (analysis.grammar.score < 7.0) {
            improvements.push({
                area: '语法',
                suggestion: '学习并练习复杂句型，注意时态一致性',
                exercises: ['复合句练习', '时态转换练习', '语法改错练习']
            });
        }

        return improvements;
    }

    // 辅助方法
    detectAdvancedVocabulary(vocabulary) {
        const advancedWords = [
            'consequently', 'furthermore', 'nevertheless', 'significantly', 'substantial',
            'comprehensive', 'innovative', 'perspective', 'criterion', 'phenomenon',
            'sophisticated', 'elaborate', 'substantial', 'compelling', 'intricate'
        ];
        
        return vocabulary.filter(word => 
            advancedWords.includes(word.toLowerCase()) || word.length > 8
        );
    }

    calculateRepetition(words) {
        const wordCount = {};
        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
        });
        
        const repeatedWords = Object.values(wordCount).filter(count => count > 2);
        return repeatedWords.length / words.length;
    }

    detectComplexStructures(text) {
        const patterns = [
            /\b(although|though|even though|whereas|while)\b/gi,
            /\b(because|since|as|due to|owing to)\b/gi,
            /\b(if|unless|provided that|assuming that)\b/gi,
            /\b(which|who|that|where|when)\b/gi,
            /\b(not only.*but also|either.*or|neither.*nor)\b/gi
        ];
        
        return patterns.filter(pattern => pattern.test(text));
    }

    detectGrammarErrors(text) {
        const errors = [];
        
        // 简单的语法错误检测
        if (/\ba\s+[aeiou]/gi.test(text)) {
            errors.push({ type: 'article', message: '冠词使用错误 (a/an)' });
        }
        
        if (/\bis\s+\w+ing\b/gi.test(text) && /\bwas\s+\w+ing\b/gi.test(text)) {
            errors.push({ type: 'tense', message: '时态不一致' });
        }
        
        return errors;
    }

    detectPronunciationIssues(text) {
        const difficultWords = ['through', 'thought', 'thorough', 'world', 'rural', 'library'];
        const words = text.toLowerCase().split(/\s+/);
        
        return words.filter(word => 
            difficultWords.some(difficult => word.includes(difficult))
        );
    }

    analyzeTopicRelevance(text, category) {
        const topicKeywords = {
            'Part 1': ['family', 'hometown', 'work', 'study', 'hobby', 'daily', 'routine'],
            'Part 2': ['describe', 'remember', 'experience', 'important', 'special', 'favorite'],
            'Part 3': ['society', 'government', 'education', 'technology', 'future', 'opinion'],
            'Practice': ['practice', 'improve', 'learn', 'skill', 'language']
        };
        
        const keywords = topicKeywords[category] || [];
        const textLower = text.toLowerCase();
        
        return keywords.filter(keyword => textLower.includes(keyword));
    }

    detectLogicalConnectors(text) {
        const connectors = [
            'firstly', 'secondly', 'finally', 'moreover', 'furthermore', 'however',
            'therefore', 'consequently', 'for example', 'for instance', 'in addition',
            'on the other hand', 'in conclusion', 'to sum up'
        ];
        
        const textLower = text.toLowerCase();
        return connectors.filter(connector => textLower.includes(connector));
    }

    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpeechAnalysisEngine, AIAnalysisEngine };
} 