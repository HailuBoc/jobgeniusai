"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    // Temporarily using fallback due to AI model issues
    // const result = await model.generateContent(prompt);
    // const response = result.response;
    // const text = response.text();
    // const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    // const quiz = JSON.parse(cleanedText);

    // Fallback quiz questions based on common interview topics
    const fallbackQuestions = [
      {
        question: `What is the most important skill for a ${user.industry} professional?`,
        options: [
          "Technical proficiency",
          "Communication skills",
          "Problem-solving ability",
          "Leadership skills",
        ],
        correctAnswer: "Problem-solving ability",
        explanation:
          "Problem-solving is crucial in any industry as it demonstrates the ability to handle challenges effectively.",
      },
      {
        question: "How do you approach learning new technologies?",
        options: [
          "Wait for training sessions",
          "Self-study with online resources",
          "Learn from colleagues",
          "Focus only on what's required for current projects",
        ],
        correctAnswer: "Self-study with online resources",
        explanation:
          "Proactive self-learning shows initiative and adaptability in a rapidly changing technical landscape.",
      },
      {
        question: "What's your approach to handling project deadlines?",
        options: [
          "Work overtime to meet deadlines",
          "Communicate early if deadlines are unrealistic",
          "Focus on quality even if it means missing deadlines",
          "Delegate all work to team members",
        ],
        correctAnswer: "Communicate early if deadlines are unrealistic",
        explanation:
          "Early communication about timeline issues allows for better planning and resource allocation.",
      },
      {
        question: "How do you ensure code quality in your projects?",
        options: [
          "Rely on testing team",
          "Write comprehensive tests and code reviews",
          "Focus on features over quality",
          "Use automated tools only",
        ],
        correctAnswer: "Write comprehensive tests and code reviews",
        explanation:
          "Combining automated testing with manual code reviews provides the best quality assurance.",
      },
      {
        question: "What's your strategy for debugging complex issues?",
        options: [
          "Random trial and error",
          "Systematic isolation of variables",
          "Ask senior developers immediately",
          "Rewrite the entire module",
        ],
        correctAnswer: "Systematic isolation of variables",
        explanation:
          "A systematic approach to debugging is more efficient and helps in understanding the root cause.",
      },
      {
        question: "How do you handle disagreements with team members?",
        options: [
          "Avoid confrontation",
          "Focus on data and facts to find common ground",
          "Insist on your approach",
          "Escalate to management immediately",
        ],
        correctAnswer: "Focus on data and facts to find common ground",
        explanation:
          "Data-driven discussions help resolve conflicts objectively and lead to better solutions.",
      },
      {
        question: "What motivates you in your professional career?",
        options: [
          "Salary and benefits",
          "Learning new skills and solving challenges",
          "Job security",
          "Recognition from peers",
        ],
        correctAnswer: "Learning new skills and solving challenges",
        explanation:
          "Continuous learning and challenge-driven motivation leads to long-term career growth.",
      },
      {
        question: "How do you prioritize multiple competing tasks?",
        options: [
          "Work on the easiest tasks first",
          "Focus on the most urgent deadlines",
          "Assess impact and urgency to prioritize",
          "Work on tasks you enjoy most",
        ],
        correctAnswer: "Assess impact and urgency to prioritize",
        explanation:
          "Evaluating both impact and urgency ensures the most valuable work is completed first.",
      },
      {
        question: "What's your approach to mentoring junior developers?",
        options: [
          "Let them learn on their own",
          "Provide guidance and encourage independent problem-solving",
          "Give them all the answers",
          "Avoid mentoring to focus on your own work",
        ],
        correctAnswer:
          "Provide guidance and encourage independent problem-solving",
        explanation:
          "Effective mentoring balances guidance with allowing juniors to develop their problem-solving skills.",
      },
      {
        question: "How do you stay updated with industry trends?",
        options: [
          "Rely on company training",
          "Follow industry blogs, attend conferences, and participate in communities",
          "Focus only on current job requirements",
          "Wait for colleagues to share information",
        ],
        correctAnswer:
          "Follow industry blogs, attend conferences, and participate in communities",
        explanation:
          "Active engagement with the industry community helps maintain relevance and continuous growth.",
      },
    ];

    return fallbackQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`,
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      // Temporarily using fallback due to AI model issues
      // const tipResult = await model.generateContent(improvementPrompt);
      // improvementTip = tipResult.response.text().trim();

      // Fallback improvement tips based on common patterns
      const fallbackTips = [
        "Focus on strengthening your foundational knowledge in core concepts.",
        "Practice more hands-on exercises to reinforce your understanding.",
        "Review best practices and industry standards for better implementation.",
        "Consider studying real-world case studies to improve practical application.",
        "Dedicate time to understand the 'why' behind solutions, not just the 'how'.",
      ];

      improvementTip = fallbackTips[wrongAnswers.length % fallbackTips.length];
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
