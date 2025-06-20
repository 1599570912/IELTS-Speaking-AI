// IELTS Speaking Question Bank
class IELTSQuestionBank {
    constructor() {
        this.questionBank = {
            'Part 1': {
                // 个人信息类
                'Personal Information': [
                    "What's your full name?",
                    "Can I see your ID?",
                    "Where are you from?",
                    "Do you work or study?",
                    "What do you do for work/study?",
                    "Do you like your job/studies? Why?"
                ],
                // 家庭和朋友
                'Family & Friends': [
                    "Do you have a large family?",
                    "How much time do you spend with your family?",
                    "What do you like to do together as a family?",
                    "Do you prefer spending time with family or friends?",
                    "How often do you meet your friends?",
                    "What do you usually do with your friends?"
                ],
                // 兴趣爱好
                'Hobbies & Interests': [
                    "What do you like to do in your free time?",
                    "Do you have any hobbies?",
                    "When did you start this hobby?",
                    "Is it an expensive hobby?",
                    "What hobbies are popular in your country?",
                    "Do you think hobbies should be shared with other people?"
                ],
                // 科技类
                'Technology': [
                    "Do you use the internet very much?",
                    "When did you first start using the internet?",
                    "What do you do on the internet?",
                    "Do you think the internet is useful?",
                    "What are the pros and cons of children using the internet?"
                ],
                // 音乐类
                'Music': [
                    "Do you like music?",
                    "What kind of music do you like?",
                    "Have you ever learned to play a musical instrument?",
                    "Which instrument would you prefer to study - the piano or the violin?",
                    "Do you think it's important for children to learn a musical instrument?"
                ],
                // 运动健身
                'Sports & Exercise': [
                    "Do you like sport?",
                    "What sports do you play?",
                    "What's the most popular sport in your country?",
                    "What's your favorite sport to watch on TV?",
                    "Do you think children should play sport?",
                    "What are the benefits of playing sport?"
                ]
            },
            'Part 2': [
                {
                    topic: "Describe a person you admire",
                    cue_card: `Describe a person you admire
                    
You should say:
• Who this person is
• How you know about this person  
• What this person does
• And explain why you admire this person

You have one minute to think about what you're going to say.
You can make some notes to help you if you wish.`,
                    follow_up: [
                        "What qualities make a person admirable?",
                        "Do you think children need role models?",
                        "What influence can famous people have on society?"
                    ]
                },
                {
                    topic: "Describe a memorable journey",
                    cue_card: `Describe a memorable journey you have taken
                    
You should say:
• Where you went
• Who you went with
• How you traveled there
• And explain why this journey was memorable

You have one minute to think about what you're going to say.
You can make some notes to help you if you wish.`,
                    follow_up: [
                        "What are the benefits of traveling?",
                        "How has traveling changed over the years?",
                        "Do you think space travel will be common in the future?"
                    ]
                },
                {
                    topic: "Describe a skill you learned",
                    cue_card: `Describe a skill you learned recently
                    
You should say:
• What the skill is
• How you learned it
• How long it took you to learn
• And explain how this skill has helped you

You have one minute to think about what you're going to say.
You can make some notes to help you if you wish.`,
                    follow_up: [
                        "What skills are most important in today's world?",
                        "How do people usually learn new skills?",
                        "Should schools teach more practical skills?"
                    ]
                },
                {
                    topic: "Describe a place you want to visit",
                    cue_card: `Describe a place you would like to visit
                    
You should say:
• Where this place is
• How you know about this place
• What you would do there
• And explain why you want to visit this place

You have one minute to think about what you're going to say.
You can make some notes to help you if you wish.`,
                    follow_up: [
                        "Why do people like to travel to different places?",
                        "What are the advantages and disadvantages of tourism?",
                        "How do you think tourism will change in the future?"
                    ]
                }
            ],
            'Part 3': {
                'Education': [
                    "What are the advantages of online learning?",
                    "How has education changed in recent years?",
                    "Do you think traditional teaching methods are still effective?",
                    "What role should technology play in education?",
                    "How important is it for students to learn practical skills?",
                    "What are the benefits of studying abroad?"
                ],
                'Environment': [
                    "What are the main environmental problems in your country?",
                    "How can individuals help protect the environment?",
                    "Do you think governments are doing enough to tackle climate change?",
                    "What role should businesses play in environmental protection?",
                    "How might cities change in the future to be more environmentally friendly?",
                    "Is it realistic to expect people to change their lifestyle to help the environment?"
                ],
                'Technology': [
                    "How has technology changed the way people communicate?",
                    "What are the advantages and disadvantages of social media?",
                    "Do you think artificial intelligence will replace human workers?",
                    "How might technology change education in the future?",
                    "What are the potential risks of our increasing dependence on technology?",
                    "How can we ensure technology is used responsibly?"
                ],
                'Society': [
                    "How has family life changed in recent decades?",
                    "What are the advantages and disadvantages of living in a big city?",
                    "How important is it to preserve cultural traditions?",
                    "What role should governments play in people's lives?",
                    "How can communities be made stronger?",
                    "What are the main challenges facing young people today?"
                ]
            }
        };
        
        this.currentQuestion = null;
        this.questionHistory = [];
        this.practiceStats = {
            totalQuestions: 0,
            byPart: { 'Part 1': 0, 'Part 2': 0, 'Part 3': 0 },
            byTopic: {}
        };
    }

    // 获取随机题目
    getRandomQuestion(part, topic = null) {
        const questions = this.questionBank[part];
        
        if (part === 'Part 1') {
            if (topic && questions[topic]) {
                const topicQuestions = questions[topic];
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                return {
                    part: part,
                    topic: topic,
                    question: topicQuestions[randomIndex],
                    type: 'short_answer'
                };
            } else {
                // 随机选择话题和问题
                const topics = Object.keys(questions);
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                const topicQuestions = questions[randomTopic];
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                return {
                    part: part,
                    topic: randomTopic,
                    question: topicQuestions[randomIndex],
                    type: 'short_answer'
                };
            }
        } else if (part === 'Part 2') {
            const randomIndex = Math.floor(Math.random() * questions.length);
            return {
                part: part,
                ...questions[randomIndex],
                type: 'long_answer'
            };
        } else if (part === 'Part 3') {
            if (topic && questions[topic]) {
                const topicQuestions = questions[topic];
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                return {
                    part: part,
                    topic: topic,
                    question: topicQuestions[randomIndex],
                    type: 'discussion'
                };
            } else {
                const topics = Object.keys(questions);
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                const topicQuestions = questions[randomTopic];
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                return {
                    part: part,
                    topic: randomTopic,
                    question: topicQuestions[randomIndex],
                    type: 'discussion'
                };
            }
        }
    }

    // 获取题目建议和技巧
    getQuestionTips(part, topic = null) {
        const tips = {
            'Part 1': {
                general: [
                    "Keep answers concise (20-30 seconds)",
                    "Use present tense for current situations",
                    "Add personal details and examples",
                    "Show enthusiasm in your voice"
                ],
                'Personal Information': [
                    "Be honest and natural",
                    "Practice introducing yourself clearly",
                    "Prepare to spell your name if needed"
                ],
                'Family & Friends': [
                    "Use family vocabulary accurately",
                    "Describe relationships and activities",
                    "Compare past and present situations"
                ],
                'Hobbies & Interests': [
                    "Explain why you enjoy the activity",
                    "Use hobby-related vocabulary",
                    "Mention frequency and duration"
                ]
            },
            'Part 2': {
                general: [
                    "Speak for 1-2 minutes continuously",
                    "Use the preparation time effectively",
                    "Cover all bullet points in the cue card",
                    "Use a variety of tenses and vocabulary",
                    "Include specific details and examples"
                ]
            },
            'Part 3': {
                general: [
                    "Give detailed, analytical answers",
                    "Express and justify opinions",
                    "Compare different viewpoints",
                    "Use complex grammatical structures",
                    "Discuss abstract concepts"
                ]
            }
        };

        if (part === 'Part 1' && topic && tips[part][topic]) {
            return [...tips[part].general, ...tips[part][topic]];
        }
        return tips[part].general;
    }

    // 记录练习统计
    recordPractice(part, topic) {
        this.practiceStats.totalQuestions++;
        this.practiceStats.byPart[part]++;
        
        if (!this.practiceStats.byTopic[topic]) {
            this.practiceStats.byTopic[topic] = 0;
        }
        this.practiceStats.byTopic[topic]++;
    }

    // 获取练习建议
    getPracticeRecommendations() {
        const recommendations = [];
        const { byPart, byTopic } = this.practiceStats;
        
        // 检查各部分练习均衡性
        const minPractice = Math.min(...Object.values(byPart));
        const maxPractice = Math.max(...Object.values(byPart));
        
        if (maxPractice - minPractice > 5) {
            const leastPracticed = Object.keys(byPart).find(part => byPart[part] === minPractice);
            recommendations.push({
                type: 'balance',
                message: `建议多练习 ${leastPracticed}，保持各部分练习均衡`
            });
        }

        // 话题多样性建议
        const topicCount = Object.keys(byTopic).length;
        if (topicCount < 5) {
            recommendations.push({
                type: 'variety',
                message: '尝试练习更多不同的话题，增加词汇和表达的多样性'
            });
        }

        return recommendations;
    }

    // 获取所有可用话题
    getAvailableTopics(part) {
        if (part === 'Part 1' || part === 'Part 3') {
            return Object.keys(this.questionBank[part]);
        }
        return ['Random']; // Part 2 通常是随机的
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IELTSQuestionBank;
} else if (typeof window !== 'undefined') {
    window.IELTSQuestionBank = IELTSQuestionBank;
} 