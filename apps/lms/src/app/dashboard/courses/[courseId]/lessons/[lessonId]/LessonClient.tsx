'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LessonClientProps {
  lessonData: any; // Replace with proper type
  courseId: string;
  lessonId: string;
}

export default function LessonClient({ lessonData, courseId, lessonId }: LessonClientProps) {
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(lessonData.quiz.questions.length).fill(-1)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === lessonData.quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    return (correctAnswers / lessonData.quiz.questions.length) * 100;
  };

  const handleQuizSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizSubmitted(true);
  };

  const handleNextLesson = () => {
    router.push(`/dashboard/courses/${courseId}/lessons/${lessonData.nextLesson.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Video Section */}
      <div className="aspect-video bg-background-secondary rounded-lg overflow-hidden">
        <iframe
          src={lessonData.video}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Content Section */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lessonData.content }} />
      </div>

      {/* Quiz Section */}
      <div className="bg-background-secondary p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{lessonData.quiz.title}</h3>
        <div className="space-y-6">
          {lessonData.quiz.questions.map((question: any, questionIndex: number) => (
            <div key={question.id} className="space-y-4">
              <p className="font-medium">{question.question}</p>
              <div className="space-y-2">
                {question.options.map((option: string, optionIndex: number) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                    disabled={quizSubmitted}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedAnswers[questionIndex] === optionIndex
                        ? 'border-button-primary bg-button-primary/10'
                        : 'border-border hover:border-button-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleQuizSubmit}
            disabled={selectedAnswers.includes(-1)}
            className="mt-6 btn-primary w-full"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                Your Score: {score.toFixed(1)}%
              </p>
              <p className="text-text-secondary">
                {score >= lessonData.quiz.passingScore
                  ? 'Congratulations! You passed the quiz!'
                  : 'Keep practicing! Try the quiz again.'}
              </p>
            </div>
            {score >= lessonData.quiz.passingScore && (
              <button
                onClick={handleNextLesson}
                className="btn-primary w-full"
              >
                Next Lesson: {lessonData.nextLesson.title}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 