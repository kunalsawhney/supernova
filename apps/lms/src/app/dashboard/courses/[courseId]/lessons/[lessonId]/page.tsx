import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data - would come from API in real application
const lessonData = {
  id: 1,
  title: 'Introduction to Programming',
  content: `
    <h2>Welcome to Programming</h2>
    <p>In this lesson, you'll learn the fundamental concepts of programming...</p>
    <!-- More content would be here -->
  `,
  video: 'https://example.com/lesson-video',
  duration: '15 min',
  quiz: {
    id: 1,
    title: 'Programming Basics Quiz',
    questions: [
      {
        id: 1,
        question: 'What is a variable?',
        options: [
          'A container for storing data values',
          'A mathematical equation',
          'A programming language',
          'A type of computer',
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Which of the following is a programming language?',
        options: [
          'HTML',
          'CSS',
          'Python',
          'All of the above',
        ],
        correctAnswer: 3,
      },
      // More questions...
    ],
    passingScore: 70,
  },
  nextLesson: {
    id: 2,
    title: 'Setting Up Python Environment',
  },
};

export default function LessonPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    lessonData.quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / lessonData.quiz.questions.length) * 100;
  };

  const handleQuizSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizSubmitted(true);
  };

  const handleNextLesson = () => {
    router.push(`/dashboard/courses/${params.courseId}/lessons/${lessonData.nextLesson.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-text-primary">{lessonData.title}</h1>
        <div className="flex items-center space-x-4 mt-2 text-text-secondary">
          <span>{lessonData.duration}</span>
        </div>
      </div>

      {!showQuiz ? (
        /* Lesson Content */
        <div className="card space-y-6">
          {/* Video Section */}
          <div className="aspect-video bg-background-secondary rounded-lg">
            {/* Video player would be here */}
            <div className="flex items-center justify-center h-full text-text-secondary">
              Video Player
            </div>
          </div>

          {/* Content Section */}
          <div 
            className="prose prose-text-primary max-w-none"
            dangerouslySetInnerHTML={{ __html: lessonData.content }}
          />

          {/* Start Quiz Button */}
          <button
            onClick={() => setShowQuiz(true)}
            className="btn-primary w-full"
          >
            Take Quiz to Progress
          </button>
        </div>
      ) : (
        /* Quiz Section */
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">
            {lessonData.quiz.title}
          </h2>

          {!quizSubmitted ? (
            <>
              <div className="space-y-6">
                {lessonData.quiz.questions.map((question, questionIndex) => (
                  <div key={question.id} className="space-y-4">
                    <p className="font-medium text-text-primary">
                      {questionIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedAnswers[questionIndex] === optionIndex
                              ? 'bg-button-primary text-white'
                              : 'bg-background hover:bg-background-secondary text-text-primary'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleQuizSubmit}
                disabled={selectedAnswers.length !== lessonData.quiz.questions.length}
                className="btn-primary w-full disabled:opacity-50"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            /* Quiz Results */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-text-primary mb-2">
                  {score}%
                </p>
                <p className="text-text-secondary">
                  {score >= lessonData.quiz.passingScore
                    ? 'Congratulations! You passed the quiz!'
                    : 'Keep practicing! You need to score at least ' + lessonData.quiz.passingScore + '% to proceed.'}
                </p>
              </div>

              {score >= lessonData.quiz.passingScore ? (
                <button
                  onClick={handleNextLesson}
                  className="btn-primary w-full"
                >
                  Continue to Next Lesson: {lessonData.nextLesson.title}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers([]);
                  }}
                  className="btn-secondary w-full"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 