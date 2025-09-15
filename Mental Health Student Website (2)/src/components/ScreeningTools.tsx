import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  TrendingUp,
  Brain
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: { value: number; label: string; }[];
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  type: 'phq9' | 'gad7' | 'ghq12' | 'stress' | 'burnout';
  questions: Question[];
  scoring: {
    ranges: { min: number; max: number; level: string; description: string; color: string; }[];
  };
  duration: string;
}

interface AssessmentResult {
  assessmentId: string;
  score: number;
  level: string;
  description: string;
  recommendations: string[];
  date: Date;
}

interface ScreeningToolsProps {
  user: { id: string; name: string; email: string; role: string };
}

export function ScreeningTools({ user }: ScreeningToolsProps) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [showResult, setShowResult] = useState(false);

  const assessments: Assessment[] = [
    {
      id: 'phq9',
      name: 'PHQ-9 Depression Screening',
      description: 'Patient Health Questionnaire for assessing depression severity',
      type: 'phq9',
      duration: '5-7 minutes',
      questions: [
        {
          id: 'phq1',
          text: 'Little interest or pleasure in doing things',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'phq2',
          text: 'Feeling down, depressed, or hopeless',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'phq3',
          text: 'Trouble falling or staying asleep, or sleeping too much',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'phq4',
          text: 'Feeling tired or having little energy',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'phq5',
          text: 'Poor appetite or overeating',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        }
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: 'Minimal', description: 'Minimal depression symptoms', color: 'bg-green-100 text-green-800' },
          { min: 5, max: 9, level: 'Mild', description: 'Mild depression symptoms', color: 'bg-yellow-100 text-yellow-800' },
          { min: 10, max: 14, level: 'Moderate', description: 'Moderate depression symptoms', color: 'bg-orange-100 text-orange-800' },
          { min: 15, max: 27, level: 'Severe', description: 'Severe depression symptoms', color: 'bg-red-100 text-red-800' }
        ]
      }
    },
    {
      id: 'gad7',
      name: 'GAD-7 Anxiety Screening',
      description: 'Generalized Anxiety Disorder 7-item scale',
      type: 'gad7',
      duration: '3-5 minutes',
      questions: [
        {
          id: 'gad1',
          text: 'Feeling nervous, anxious, or on edge',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'gad2',
          text: 'Not being able to stop or control worrying',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'gad3',
          text: 'Worrying too much about different things',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 'gad4',
          text: 'Trouble relaxing',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        }
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: 'Minimal', description: 'Minimal anxiety symptoms', color: 'bg-green-100 text-green-800' },
          { min: 5, max: 9, level: 'Mild', description: 'Mild anxiety symptoms', color: 'bg-yellow-100 text-yellow-800' },
          { min: 10, max: 14, level: 'Moderate', description: 'Moderate anxiety symptoms', color: 'bg-orange-100 text-orange-800' },
          { min: 15, max: 21, level: 'Severe', description: 'Severe anxiety symptoms', color: 'bg-red-100 text-red-800' }
        ]
      }
    },
    {
      id: 'stress',
      name: 'Academic Stress Assessment',
      description: 'Evaluate your current level of academic stress and pressure',
      type: 'stress',
      duration: '4-6 minutes',
      questions: [
        {
          id: 'stress1',
          text: 'How often do you feel overwhelmed by your coursework?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Always' }
          ]
        },
        {
          id: 'stress2',
          text: 'How difficult is it to manage your study schedule?',
          options: [
            { value: 0, label: 'Very easy' },
            { value: 1, label: 'Easy' },
            { value: 2, label: 'Moderate' },
            { value: 3, label: 'Difficult' },
            { value: 4, label: 'Very difficult' }
          ]
        },
        {
          id: 'stress3',
          text: 'How often do you worry about your academic performance?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Always' }
          ]
        }
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: 'Low', description: 'Low stress levels', color: 'bg-green-100 text-green-800' },
          { min: 5, max: 8, level: 'Moderate', description: 'Moderate stress levels', color: 'bg-yellow-100 text-yellow-800' },
          { min: 9, max: 12, level: 'High', description: 'High stress levels', color: 'bg-red-100 text-red-800' }
        ]
      }
    }
  ];

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentAssessment && currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    if (!currentAssessment) return;

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const range = currentAssessment.scoring.ranges.find(r => 
      totalScore >= r.min && totalScore <= r.max
    );

    if (range) {
      const result: AssessmentResult = {
        assessmentId: currentAssessment.id,
        score: totalScore,
        level: range.level,
        description: range.description,
        recommendations: getRecommendations(currentAssessment.type, range.level),
        date: new Date()
      };

      setResults(prev => [result, ...prev]);
      setShowResult(true);
    }
  };

  const getRecommendations = (type: string, level: string): string[] => {
    const baseRecommendations = [
      'Practice regular self-care and stress management techniques',
      'Maintain a healthy sleep schedule and exercise routine',
      'Stay connected with supportive friends and family'
    ];

    if (level === 'Moderate' || level === 'High' || level === 'Severe') {
      return [
        ...baseRecommendations,
        'Consider scheduling a session with a counselor',
        'Explore our mindfulness and relaxation resources',
        'Join our peer support community for additional help'
      ];
    }

    return baseRecommendations;
  };

  const resetAssessment = () => {
    setCurrentAssessment(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
  };

  const progress = currentAssessment ? 
    ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100 : 0;

  const currentQuestion = currentAssessment?.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-2">Self-Assessment Tools</h2>
        <p className="text-gray-600">
          Take standardized psychological screenings to understand your mental health
        </p>
      </div>

      {!currentAssessment ? (
        /* Assessment Selection */
        <div className="space-y-6">
          {/* Available Assessments */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <ClipboardList className="h-8 w-8 text-blue-600" />
                    <Badge variant="outline" className="text-xs">
                      {assessment.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{assessment.name}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p>{assessment.questions.length} questions</p>
                    </div>
                    <Button 
                      onClick={() => startAssessment(assessment)}
                      className="w-full"
                    >
                      Start Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Previous Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Assessment History
                </CardTitle>
                <CardDescription>
                  Track your mental health progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.slice(0, 5).map((result, index) => {
                    const assessment = assessments.find(a => a.id === result.assessmentId);
                    const range = assessment?.scoring.ranges.find(r => r.level === result.level);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm">{assessment?.name}</h4>
                          <p className="text-xs text-gray-600">
                            {result.date.toLocaleDateString()} • Score: {result.score}
                          </p>
                        </div>
                        <Badge className={range?.color}>
                          {result.level}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : showResult ? (
        /* Results Display */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Assessment Complete
              </CardTitle>
              <CardDescription>
                {currentAssessment.name} results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Display */}
                <div className="text-center space-y-4">
                  <div className="text-4xl">{Object.values(answers).reduce((sum, score) => sum + score, 0)}</div>
                  <div>
                    {(() => {
                      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
                      const range = currentAssessment.scoring.ranges.find(r => 
                        totalScore >= r.min && totalScore <= r.max
                      );
                      return range ? (
                        <Badge className={`${range.color} text-base px-4 py-2`}>
                          {range.level} - {range.description}
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-lg">Recommendations</h3>
                  <ul className="space-y-2">
                    {(() => {
                      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
                      const range = currentAssessment.scoring.ranges.find(r => 
                        totalScore >= r.min && totalScore <= r.max
                      );
                      const recommendations = getRecommendations(currentAssessment.type, range?.level || 'Minimal');
                      return recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button onClick={resetAssessment} variant="outline" className="flex-1">
                    Take Another Assessment
                  </Button>
                  <Button className="flex-1">
                    Schedule Counseling Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="text-blue-900 mb-1">Important Notice</h4>
                <p className="text-blue-800">
                  These screenings are for educational purposes only and do not replace professional 
                  diagnosis. If you're experiencing significant distress, please contact a mental 
                  health professional or our crisis support services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Assessment Questions */
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg">{currentAssessment.name}</h3>
                  <span className="text-sm text-gray-600">
                    {currentQuestionIndex + 1} of {currentAssessment.questions.length}
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Over the last 2 weeks, how often have you been bothered by:
                </CardTitle>
                <CardDescription className="text-lg">
                  {currentQuestion.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={currentAnswer?.toString()}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value.toString()} 
                          id={`option-${option.value}`}
                        />
                        <Label 
                          htmlFor={`option-${option.value}`}
                          className="text-base cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetAssessment}>
                Exit Assessment
              </Button>
              <Button 
                onClick={nextQuestion}
                disabled={currentAnswer === undefined}
              >
                {currentQuestionIndex === (currentAssessment?.questions.length || 0) - 1 
                  ? 'View Results' 
                  : 'Next'
                }
              </Button>
            </div>
          </div>

          {/* Privacy Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-start space-x-3">
              <Brain className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="text-green-900 mb-1">Your Privacy Matters</h4>
                <p className="text-green-800">
                  Your responses are confidential and will only be used to provide you with 
                  personalized recommendations and track your progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}