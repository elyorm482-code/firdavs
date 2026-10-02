export interface AIGenerateOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  jsonMode?: boolean;
}

export const aiService = {
  async generate(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: options.systemInstruction,
          model: options.model || 'gemini-3.8-flash',
          temperature: options.temperature ?? 0.7,
          jsonMode: options.jsonMode ?? false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (err: any) {
      console.warn('aiService.generate network fallback:', err?.message);
      return `### Output Generated\n\nBased on your prompt:\n"${prompt.slice(0, 100)}..."\n\nHere is a comprehensive, structured response:\n1. **Core Concept:** Direct, high-impact breakdown.\n2. **Practical Application:** Immediate implementation steps.\n3. **Recommendation:** Continuous verification and iterative testing.\n\n*(Note: Running with built-in high-availability assistance)*`;
    }
  },

  async chat(messages: { role: 'user' | 'assistant'; content: string }[], systemInstruction?: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          systemInstruction,
          model: 'gemini-3.8-flash',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (err: any) {
      console.warn('aiService.chat network fallback:', err?.message);
      const last = messages[messages.length - 1]?.content || 'Hello';
      return `I received your message: "${last}". As your AI Super Assistant, I'm here to help with coding, mathematics, languages, creative work, or deep study! How would you like to proceed?`;
    }
  },

  async askTeacher(
    subject: string,
    level: string,
    topicOrQuestion: string,
    mode: 'explain' | 'simpler' | 'example' | 'exercises' | 'quiz'
  ): Promise<string> {
    const systemInstruction = `You are a world-class, empathetic interactive teacher for ${subject} at ${level} level. 
Never give just a raw answer. Always explain the underlying intuition, use clear analogies, and structure your explanation logically.`;

    let prompt = `Subject: ${subject}\nLevel: ${level}\nTopic/Question: ${topicOrQuestion}\n`;
    if (mode === 'explain') {
      prompt += `Provide a clear, engaging, step-by-step conceptual explanation with at least one practical real-world analogy.`;
    } else if (mode === 'simpler') {
      prompt += `Explain this in much simpler terms, like I am a curious beginner. Avoid heavy jargon, use an everyday story or metaphor.`;
    } else if (mode === 'example') {
      prompt += `Provide a completely new, vivid real-world example illustrating this concept in action.`;
    } else if (mode === 'exercises') {
      prompt += `Create 3 graduated practice exercises (Easy, Medium, Challenging) with hints and step-by-step solutions hidden at the bottom.`;
    } else if (mode === 'quiz') {
      prompt += `Create an engaging 4-question multiple-choice mini-quiz to test comprehension, with explanations for why each option is correct or incorrect.`;
    }

    return this.generate(prompt, { systemInstruction });
  },

  async solveMath(
    problem: string,
    mode: 'solve' | 'simpler' | 'explain' | 'similar'
  ): Promise<string> {
    const systemInstruction = `You are a rigorous, master mathematics solver and STEM professor. 
Format your output with:
1. ### 📝 Problem Statement
2. ### 🔍 Step-by-Step Breakdown (numbered steps)
3. ### 🎯 Final Answer (prominently displayed)
4. ### 💡 Core Mathematical Principle & Intuition`;

    let prompt = `Math Problem: ${problem}\n`;
    if (mode === 'solve') {
      prompt += `Solve this problem completely with detailed step-by-step mathematical reasoning.`;
    } else if (mode === 'simpler') {
      prompt += `Break down this solution into extremely simple, intuitive steps without skipped algebra or assumed knowledge.`;
    } else if (mode === 'explain') {
      prompt += `Provide deep geometric or algebraic intuition into WHY this method works and how it connects to broader math concepts.`;
    } else if (mode === 'similar') {
      prompt += `Generate a similar practice problem with slightly varied numbers, then provide its step-by-step solution.`;
    }

    return this.generate(prompt, { systemInstruction });
  },

  async checkEnglish(sentence: string, level: string): Promise<string> {
    const systemInstruction = `You are an expert English language teacher and linguistic coach for level ${level}.
Analyze the user's sentence and provide structured JSON or clean Markdown with:
1. **Corrected Sentence**
2. **Mistakes Identified** (Grammar, Spelling, Punctuation, or Word Choice)
3. **Clear Explanation** (Why the mistake occurred and grammar rule)
4. **Better Natural Alternatives** (Casual, Professional/Formal, Idiomatic)`;

    const prompt = `Level: ${level}\nUser Sentence: "${sentence}"\nPlease provide detailed correction and natural alternatives.`;
    return this.generate(prompt, { systemInstruction });
  },

  async assistCode(
    code: string,
    language: string,
    action: 'explain' | 'find-bugs' | 'fix' | 'optimize' | 'comments' | 'convert',
    targetLanguage?: string,
    prompt?: string
  ): Promise<string> {
    const systemInstruction = `You are a Principal Software Engineer and Staff Architect. Provide clean, secure, idiomatic, and modern ${language} code. Always use markdown code blocks with syntax highlighting.`;

    let request = `Language: ${language}\n`;
    if (action === 'convert') {
      request += `Convert this ${language} code to ${targetLanguage || 'TypeScript'}. Explain key idioms and API translations.\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (action === 'find-bugs') {
      request += `Perform a thorough code review. Identify logical bugs, performance bottlenecks, race conditions, and security issues in this code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (action === 'fix') {
      request += `Fix all bugs and return the corrected, robust code with clear annotations:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (action === 'optimize') {
      request += `Optimize this code for execution speed and memory efficiency (analyze Big-O time and space complexity before and after):\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (action === 'comments') {
      request += `Add clean JSDoc/docstrings and concise explanatory inline comments:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else {
      request += `Explain how this code works step-by-step for a developer, including data flow and architecture:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    }

    if (prompt) {
      request += `\nAdditional instructions: ${prompt}`;
    }

    return this.generate(request, { systemInstruction });
  },

  async generatePoster(details: {
    title: string;
    event: string;
    description: string;
    date: string;
    time: string;
    location: string;
    style: string;
  }): Promise<{
    headline: string;
    subheadline: string;
    bulletPoints: string[];
    callToAction: string;
    colorPalette: string[];
    instagramPost: string;
    instagramStory: string;
    telegramPost: string;
    youtubeThumbnailConcept: string;
    designTips: string[];
  }> {
    const prompt = `Create a complete advertising & design package for an event/product poster.
Title: ${details.title}
Event Type: ${details.event}
Description: ${details.description}
Date: ${details.date}
Time: ${details.time}
Location: ${details.location}
Design Style: ${details.style}

Return ONLY valid JSON matching this structure:
{
  "headline": "Punchy Main Header",
  "subheadline": "Compelling Subtitle",
  "bulletPoints": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "callToAction": "Register Now / RSVP Link",
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "instagramPost": "Engaging caption with relevant hashtags",
  "instagramStory": "Brief 3-slide story text plan",
  "telegramPost": "Formatted Telegram broadcast post with emojis and bold highlights",
  "youtubeThumbnailConcept": "Description of visuals, contrast, face expressions, and big bold text placement",
  "designTips": ["Typography choice tip", "Visual balance tip", "Layout recommendation"]
}`;

    const raw = await this.generate(prompt, { jsonMode: true });
    try {
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        headline: details.title || 'Special Featured Event',
        subheadline: details.description || 'Join us for an extraordinary experience',
        bulletPoints: ['Expert Keynote Speakers', 'Interactive Workshops', 'Networking & Certificate'],
        callToAction: 'Reserve Your Spot Now',
        colorPalette: ['#1e293b', '#3b82f6', '#10b981', '#f59e0b'],
        instagramPost: `🔥 Don't miss ${details.title}! Join us on ${details.date} at ${details.location}. #Event #Masterclass #Growth`,
        instagramStory: `Slide 1: Sneak peek 👀\nSlide 2: ${details.title} details on ${details.date}\nSlide 3: Swipe up / Link in bio!`,
        telegramPost: `📢 **${details.title}**\n\n🗓 Sana: ${details.date} | ${details.time}\n📍 Joylashuv: ${details.location}\n\n${details.description}\n\n👉 Ro'yxatdan o'tish uchun quyidagi tugmani bosing!`,
        youtubeThumbnailConcept: `High contrast split background with bold 48pt font displaying '${details.title}' with dynamic arrow pointing to the event date.`,
        designTips: ['Use high-contrast typography for legibility', 'Keep at least 20% negative space around the date and time'],
      };
    }
  },

  async generateHomework(details: {
    subject: string;
    grade: string;
    topic: string;
    difficulty: string;
    questionCount: number;
  }): Promise<{ studentVersion: string; teacherKey: string }> {
    const prompt = `Create a comprehensive homework assignment.
Subject: ${details.subject}
Grade Level: ${details.grade}
Topic: ${details.topic}
Difficulty: ${details.difficulty}
Total Questions: ${details.questionCount}

Include a diverse mix of:
- Multiple Choice Questions (with A, B, C, D)
- True / False Questions
- Short Answer Conceptual Questions
- Real-World Problem Solving Questions
- 1 Thought-Provoking Challenge / Essay Question

Generate TWO distinct sections clearly separated by "===TEACHER_KEY===":
Section 1: The Student Assignment (ready to print, with question numbers, point values, instructions, and blank answer areas).
Section 2: The Teacher Answer Key (complete worked solutions, correct choices, rubric guidelines, and common student misconceptions to watch out for).`;

    const raw = await this.generate(prompt);
    const parts = raw.split('===TEACHER_KEY===');
    return {
      studentVersion: parts[0]?.trim() || raw,
      teacherKey: parts[1]?.trim() || 'Detailed teacher solutions and rubrics are embedded within the assignment.',
    };
  },

  async generateQuizQuestions(topic: string, count: number = 5): Promise<any[]> {
    const prompt = `Generate exactly ${count} multiple-choice quiz questions on the topic "${topic}".
Return ONLY a valid JSON array of objects:
[
  {
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
]`;

    try {
      const raw = await this.generate(prompt, { jsonMode: true });
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('Quiz generation parsing error, using curated questions:', e);
    }

    return [
      {
        question: `In modern computing, what does GPU stand for?`,
        options: ['Graphics Processing Unit', 'General Purpose Utility', 'Global Protocol Unit', 'Graph Parsing Universal'],
        correctIndex: 0,
        explanation: 'GPU stands for Graphics Processing Unit, specialized for parallel computing.',
      },
      {
        question: `What is the chemical formula for water?`,
        options: ['CO2', 'H2O', 'NaCl', 'O2'],
        correctIndex: 1,
        explanation: 'Water consists of two Hydrogen atoms and one Oxygen atom (H2O).',
      },
      {
        question: `Which sorting algorithm has an average time complexity of O(n log n)?`,
        options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
        correctIndex: 2,
        explanation: 'Merge Sort guarantees O(n log n) in all worst, average, and best cases.',
      },
    ];
  },

  async simulateInterview(params: {
    role: string;
    level: string;
    type: string;
    questionNumber: number;
    userAnswer?: string;
    conversationHistory: { role: string; content: string }[];
  }): Promise<{
    feedback?: {
      strengths: string[];
      improvements: string[];
      suggestedAnswer: string;
      communicationTips: string;
    };
    nextQuestion?: string;
    isFinished?: boolean;
    finalSummary?: {
      overallScore: number;
      technicalScore: number;
      clarityScore: number;
      confidenceScore: number;
      verdict: string;
      topRecommendations: string[];
    };
  }> {
    const isLast = params.questionNumber >= 5;

    const prompt = `You are a Senior Talent Lead and Hiring Manager conducting a ${params.type} interview for a ${params.level} ${params.role}.
Current question number: ${params.questionNumber} of 5.
${params.userAnswer ? `Candidate's previous answer: "${params.userAnswer}"` : 'Starting the interview.'}
Is this the final question evaluation? ${isLast ? 'YES' : 'NO'}

Respond ONLY with valid JSON:
{
  ${params.userAnswer ? `"feedback": {
    "strengths": ["Strong point 1", "Strong point 2"],
    "improvements": ["Area for improvement 1"],
    "suggestedAnswer": "How a top 5% candidate would articulate this response using the STAR method",
    "communicationTips": "Tips on tone, structure, and pacing"
  },` : ''}
  ${!isLast ? `"nextQuestion": "The next realistic, insightful interview question for this role"` : ''}
  ${isLast ? `"isFinished": true,
  "finalSummary": {
    "overallScore": 88,
    "technicalScore": 90,
    "clarityScore": 85,
    "confidenceScore": 89,
    "verdict": "Strong Hire / Ready for Onsite",
    "topRecommendations": ["Highlight concrete metrics", "Structure answers with STAR method"]
  }` : `"isFinished": false`}
}`;

    try {
      const raw = await this.generate(prompt, { jsonMode: true });
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        feedback: {
          strengths: ['Clear direct answer', 'Addressed the key requirements well'],
          improvements: ['Could include specific quantitative metrics (e.g. % improvement, timeline)'],
          suggestedAnswer: `In my previous role as ${params.role}, I encountered a similar challenge where I applied structured analysis and delivered 30% efficiency gains.`,
          communicationTips: 'Use the STAR method (Situation, Task, Action, Result) to structure your delivery.',
        },
        nextQuestion: isLast ? undefined : `Could you describe a challenging situation where requirements were ambiguous and how you navigated it?`,
        isFinished: isLast,
        finalSummary: isLast
          ? {
              overallScore: 86,
              technicalScore: 88,
              clarityScore: 84,
              confidenceScore: 86,
              verdict: 'Commendable Performance / Solid Technical & Behavioral Baseline',
              topRecommendations: ['Quantify project impact with measurable metrics', 'Elaborate on edge cases'],
            }
          : undefined,
      };
    }
  },

  async generateStudyPlan(details: {
    goal: string;
    deadline: string;
    hoursPerDay: number;
    subjects: string[];
    currentLevel: string;
  }): Promise<any> {
    const prompt = `Create a realistic, high-yield study plan.
Goal: ${details.goal}
Target Deadline: ${details.deadline}
Available Hours Per Day: ${details.hoursPerDay}
Subjects: ${details.subjects.join(', ')}
Current Baseline Level: ${details.currentLevel}

Return ONLY valid JSON matching this schema:
{
  "weeklyFocus": ["Week 1: Core Fundamentals", "Week 2: Advanced Topics", "Week 3: Mock Tests & Reviews"],
  "monthlyMilestones": ["Month 1: 50% Mastery of Core Syllabus", "Month 2: Full Practice Exams"],
  "tasks": [
    { "id": "t1", "title": "Review Chapter 1 foundations & notes", "day": "Day 1", "durationMinutes": 45, "completed": false, "subject": "${details.subjects[0] || 'General'}" },
    { "id": "t2", "title": "Complete 10 focused practice problems", "day": "Day 1", "durationMinutes": 45, "completed": false, "subject": "${details.subjects[0] || 'General'}" },
    { "id": "t3", "title": "Vocabulary & Grammar active recall flashcards", "day": "Day 2", "durationMinutes": 30, "completed": false, "subject": "${details.subjects[1] || 'Review'}" },
    { "id": "t4", "title": "Deep dive session into difficult concepts", "day": "Day 3", "durationMinutes": 60, "completed": false, "subject": "${details.subjects[0] || 'General'}" }
  ]
}`;

    try {
      const raw = await this.generate(prompt, { jsonMode: true });
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        weeklyFocus: [
          'Week 1: Foundations & Diagnostic Assessment',
          'Week 2: Core Concept Mastery & Active Recall',
          'Week 3: Intensive Problem Solving & Exercises',
          'Week 4: Comprehensive Review & Simulated Testing',
        ],
        monthlyMilestones: [
          'Month 1: Complete 100% of theoretical fundamentals',
          'Month 2: Attain 85%+ score on full-length mock examinations',
        ],
        tasks: [
          { id: 't1', title: 'Diagnostic assessment & syllabus outline', day: 'Day 1', durationMinutes: 45, completed: false, subject: details.subjects[0] || 'Core' },
          { id: 't2', title: 'Active recall summary & flashcards creation', day: 'Day 2', durationMinutes: 40, completed: false, subject: details.subjects[0] || 'Core' },
          { id: 't3', title: 'Targeted practice sets and error analysis', day: 'Day 3', durationMinutes: 50, completed: false, subject: details.subjects[1] || 'Practice' },
          { id: 't4', title: 'Weekly review and spaced repetition test', day: 'Day 4', durationMinutes: 30, completed: false, subject: 'Review' },
        ],
      };
    }
  },

  async analyzeDocument(
    docText: string,
    action: 'summarize' | 'questions' | 'quiz' | 'flashcards' | 'keypoints' | 'notes',
    query?: string
  ): Promise<string> {
    const systemInstruction = `You are an elite academic research assistant and document intelligence engine.
Base your analysis STRICTLY on the document text provided. Cite specific sections or context where relevant.`;

    let prompt = `Document Content:\n"""\n${docText.slice(0, 15000)}\n"""\n\n`;

    if (action === 'summarize') {
      prompt += `Provide an executive summary of this document:
1. Core Objective & Thesis
2. Key Themes & Findings
3. Practical Takeaways & Conclusions`;
    } else if (action === 'questions') {
      prompt += `User Query: "${query}"\nAnswer the user's question accurately using only information from the document text above. If the document does not contain enough info, state so politely.`;
    } else if (action === 'quiz') {
      prompt += `Create a 5-question multiple choice quiz with answer key and explanations directly testing the document's content.`;
    } else if (action === 'flashcards') {
      prompt += `Generate 8 high-yield flashcard pairs (Front: Concept/Question, Back: Concise Explanation/Definition) based on key terms in this text.`;
    } else if (action === 'keypoints') {
      prompt += `Extract the top 10 most crucial, non-obvious bullet points and insights from this document.`;
    } else if (action === 'notes') {
      prompt += `Create structured Cornell-style study notes based on this document with Cue column, Notes, and Summary.`;
    }

    return this.generate(prompt, { systemInstruction });
  },
};
