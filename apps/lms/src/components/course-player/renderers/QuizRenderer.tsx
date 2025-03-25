import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronLeft, ChevronRight, AlertTriangle, HelpCircle } from 'lucide-react';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types for quiz data
interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'true-false' | 'text';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  passingScore: number;
  questions: QuizQuestion[];
}

interface QuizRendererProps {
  quizData: QuizData;
  lessonId: string;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizRenderer({
  quizData,
  lessonId,
  onComplete
}: QuizRendererProps) {
  // Context
  const { updateProgress, markComplete } = useCoursePlayer();
  
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit ? quizData.timeLimit * 60 : null);
  
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  
  // Timer for time-limited quizzes
  useEffect(() => {
    if (!timeRemaining || submitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);
  
  // Format remaining time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Handle answer change
  const handleSingleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleMultipleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(answer => answer !== value)
        };
      }
    });
  };
  
  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };
  
  // Calculate score
  const calculateScore = () => {
    let totalScore = 0;
    let earnedPoints = 0;
    
    quizData.questions.forEach(question => {
      totalScore += question.points;
      
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      
      if (question.type === 'multiple') {
        const correctAnswers = question.correctAnswer as string[];
        const userAnswers = userAnswer as string[];
        
        // Check if arrays have the same elements
        const isCorrect = 
          correctAnswers.length === userAnswers.length && 
          correctAnswers.every(answer => userAnswers.includes(answer));
        
        if (isCorrect) {
          earnedPoints += question.points;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      }
    });
    
    const percentScore = Math.round((earnedPoints / totalScore) * 100);
    return percentScore;
  };
  
  // Submit quiz
  const submitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    setShowResults(true);
    
    // Update progress
    updateProgress(lessonId, {
      progress: 100,
      completed: true
    });
    
    // Mark as complete
    markComplete(lessonId);
    
    // Call onComplete callback
    if (onComplete) {
      onComplete(finalScore, finalScore >= quizData.passingScore);
    }
  };
  
  // Reset quiz
  const retakeQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
    setTimeRemaining(quizData.timeLimit ? quizData.timeLimit * 60 : null);
  };
  
  // Check if question is answered
  const isQuestionAnswered = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return false;
    
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    
    return true;
  };
  
  // Render question based on type
  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'single':
        return (
          <RadioGroup
            value={answers[question.id] as string || ''}
            onValueChange={value => handleSingleAnswerChange(question.id, value)}
            disabled={submitted}
          >
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3",
                    submitted && question.correctAnswer === option && "bg-green-50 border-green-200",
                    submitted && answers[question.id] === option && question.correctAnswer !== option && "bg-red-50 border-red-200"
                  )}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`${question.id}-option-${index}`} 
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`${question.id}-option-${index}`}
                    className="font-normal flex-1 cursor-pointer"
                  >
                    {option}
                    {submitted && question.correctAnswer === option && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Correct
                      </Badge>
                    )}
                    {submitted && answers[question.id] === option && question.correctAnswer !== option && (
                      <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
                        <X className="h-3 w-3 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
        
      case 'multiple':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const isSelected = (answers[question.id] as string[] || []).includes(option);
              const isCorrect = (question.correctAnswer as string[]).includes(option);
              
              return (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3",
                    submitted && isCorrect && "bg-green-50 border-green-200",
                    submitted && isSelected && !isCorrect && "bg-red-50 border-red-200"
                  )}
                >
                  <Checkbox 
                    id={`${question.id}-option-${index}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      handleMultipleAnswerChange(question.id, option, !!checked);
                    }}
                    disabled={submitted}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`${question.id}-option-${index}`}
                    className="font-normal flex-1 cursor-pointer"
                  >
                    {option}
                    {submitted && isCorrect && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Correct
                      </Badge>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        );
        
      case 'true-false':
        return (
          <RadioGroup
            value={answers[question.id] as string || ''}
            onValueChange={value => handleSingleAnswerChange(question.id, value)}
            disabled={submitted}
          >
            <div className="space-y-3">
              {['True', 'False'].map((option, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3",
                    submitted && question.correctAnswer === option && "bg-green-50 border-green-200",
                    submitted && answers[question.id] === option && question.correctAnswer !== option && "bg-red-50 border-red-200"
                  )}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`${question.id}-option-${index}`} 
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`${question.id}-option-${index}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };
  
  // Show results screen
  if (showResults) {
    const passed = score >= quizData.passingScore;
    
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 shadow-sm">
          <CardHeader className={cn(
            "text-center", 
            passed 
              ? "bg-green-50 dark:bg-green-950/20 border-b border-green-100 dark:border-green-900" 
              : "bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900"
          )}>
            <div className="mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-2">
              {passed ? (
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Almost there!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {passed 
                ? 'You have successfully completed this quiz.' 
                : 'You didn\'t meet the passing score. Review the material and try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">{score}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>0%</span>
                  <span className="font-medium">{quizData.passingScore}% needed to pass</span>
                  <span>100%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      passed ? "bg-green-500" : "bg-amber-500"
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                  <div className="font-medium">{totalQuestions}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Correctly Answered</div>
                  <div className="font-medium">
                    {Object.keys(quizData.questions).filter(questionId => {
                      const question = quizData.questions.find(q => q.id === questionId);
                      if (!question) return false;
                      
                      const userAnswer = answers[questionId];
                      if (!userAnswer) return false;
                      
                      if (question.type === 'multiple') {
                        const correctAnswers = question.correctAnswer as string[];
                        const userAnswers = userAnswer as string[];
                        return correctAnswers.length === userAnswers.length && 
                          correctAnswers.every(answer => userAnswers.includes(answer));
                      } else {
                        return userAnswer === question.correctAnswer;
                      }
                    }).length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-center">
            <Button onClick={retakeQuiz}>
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Quiz header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{quizData.title}</h2>
          
          {timeRemaining !== null && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm px-3 py-1",
                timeRemaining < 60 && "bg-red-50 text-red-700 border-red-200 animate-pulse"
              )}
            >
              <span className="mr-1">⏱️</span>
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>
        
        {quizData.description && (
          <p className="text-muted-foreground mb-4">{quizData.description}</p>
        )}
        
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
          <motion.div 
            className="h-full bg-purple-500"
            initial={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
      </div>
      
      {/* Question navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quizData.questions.map((question, index) => (
          <Button
            key={question.id}
            variant={currentQuestionIndex === index ? "default" : "outline"}
            size="icon"
            className={cn(
              "w-8 h-8",
              isQuestionAnswered(question.id) && currentQuestionIndex !== index && "bg-muted"
            )}
            onClick={() => goToQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      
      {/* Current question */}
      <div className="mb-6">
        <Card>
          <CardHeader className="bg-purple-50 dark:bg-purple-950/20 border-b">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2">
                  {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                </Badge>
                <CardTitle className="text-xl mb-1">
                  {currentQuestion.question}
                </CardTitle>
                <CardDescription>
                  {currentQuestion.type === 'multiple' ? 'Select all that apply' : 'Select one answer'}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {renderQuestion(currentQuestion)}
            
            {/* Explanation (shown after submission) */}
            {submitted && currentQuestion.explanation && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                <h4 className="font-medium mb-1">Explanation:</h4>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation and submission */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button 
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < totalQuestions}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              onClick={goToNextQuestion}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 