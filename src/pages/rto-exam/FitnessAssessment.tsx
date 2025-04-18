
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  ChevronLeft, 
  HeartPulse, 
  Eye, 
  Brain, 
  FileText, 
  AlertTriangle,
  Check,
  Clock,
  Activity,
  RefreshCw,
  ArrowRight,
  Printer,
  Download,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const FitnessAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [fitnessScore, setFitnessScore] = useState({
    vision: 0,
    physical: 0,
    cognitive: 0,
    overall: 0
  });
  const [showIntro, setShowIntro] = useState(true);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Sample assessment questions
  const assessmentQuestions = [
    {
      id: 1,
      category: "vision",
      question: "Do you have any difficulty seeing distant road signs at night?",
      options: [
        { value: "no", label: "No, I can see them clearly" },
        { value: "sometimes", label: "Sometimes, especially when it's raining" },
        { value: "often", label: "Yes, I often have difficulty" },
        { value: "always", label: "I always struggle with night vision" }
      ]
    },
    {
      id: 2,
      category: "vision",
      question: "When was your last eye examination?",
      options: [
        { value: "last6months", label: "Within the last 6 months" },
        { value: "last2years", label: "Within the last 2 years" },
        { value: "over2years", label: "More than 2 years ago" },
        { value: "never", label: "I've never had an eye examination" }
      ]
    },
    {
      id: 3,
      category: "vision",
      question: "Do you need to wear corrective lenses (glasses/contacts) for driving?",
      options: [
        { value: "no", label: "No" },
        { value: "yes_always", label: "Yes, and I always wear them" },
        { value: "yes_sometimes", label: "Yes, but I sometimes forget them" },
        { value: "should", label: "I should, but don't have them" }
      ]
    },
    {
      id: 4,
      category: "physical",
      question: "Can you turn your head and neck comfortably to check blind spots?",
      options: [
        { value: "easily", label: "Yes, easily and without pain" },
        { value: "limited", label: "Yes, but with some limited movement" },
        { value: "difficulty", label: "With difficulty or mild pain" },
        { value: "unable", label: "No, I have significant pain or limitation" }
      ]
    },
    {
      id: 5,
      category: "physical",
      question: "Do you have any condition that affects your coordination or reflexes?",
      options: [
        { value: "no", label: "No" },
        { value: "mild", label: "Yes, but it's mild and doesn't affect driving" },
        { value: "moderate", label: "Yes, it occasionally affects my driving" },
        { value: "severe", label: "Yes, it significantly impacts my driving" }
      ]
    },
    {
      id: 6,
      category: "physical",
      question: "How is your ability to use your feet for the pedals?",
      options: [
        { value: "excellent", label: "Excellent, no issues" },
        { value: "good", label: "Good, but sometimes get tired on long drives" },
        { value: "limited", label: "Limited, I have some discomfort" },
        { value: "difficult", label: "Difficult, I struggle with pedal control" }
      ]
    },
    {
      id: 7,
      category: "cognitive",
      question: "Do you ever find yourself losing concentration while driving?",
      options: [
        { value: "never", label: "Never or rarely" },
        { value: "occasionally", label: "Occasionally on very long drives" },
        { value: "sometimes", label: "Sometimes, even on regular trips" },
        { value: "often", label: "Often, I find it hard to stay focused" }
      ]
    },
    {
      id: 8,
      category: "cognitive",
      question: "How would you rate your ability to make quick decisions in traffic?",
      options: [
        { value: "excellent", label: "Excellent, I react quickly and appropriately" },
        { value: "good", label: "Good, I usually make good decisions" },
        { value: "average", label: "Average, I sometimes hesitate" },
        { value: "poor", label: "Below average, I often feel overwhelmed" }
      ]
    },
    {
      id: 9,
      category: "cognitive",
      question: "Do you take any medication that may cause drowsiness or affect alertness?",
      options: [
        { value: "no", label: "No" },
        { value: "rarely", label: "Yes, but I rarely drive after taking it" },
        { value: "sometimes", label: "Yes, and I sometimes drive after taking it" },
        { value: "regularly", label: "Yes, and I regularly drive after taking it" }
      ]
    },
    {
      id: 10,
      category: "general",
      question: "When did you last receive medical clearance for driving?",
      options: [
        { value: "last6months", label: "Within the last 6 months" },
        { value: "last2years", label: "Within the last 2 years" },
        { value: "over2years", label: "More than 2 years ago" },
        { value: "never", label: "I've never had a medical clearance for driving" }
      ]
    }
  ];

  // Sample health condition list
  const healthConditionsList = [
    { id: "diabetes", label: "Diabetes" },
    { id: "epilepsy", label: "Epilepsy" },
    { id: "heart_disease", label: "Heart disease" },
    { id: "sleep_apnea", label: "Sleep apnea" },
    { id: "stroke", label: "Stroke history" },
    { id: "parkinsons", label: "Parkinson's disease" },
    { id: "vision_impairment", label: "Vision impairment" },
    { id: "hearing_impairment", label: "Hearing impairment" }
  ];

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  // Move to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle health condition toggle
  const toggleHealthCondition = (condition: string) => {
    if (healthConditions.includes(condition)) {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    } else {
      setHealthConditions([...healthConditions, condition]);
    }
  };

  // Complete the assessment and calculate scores
  const completeAssessment = () => {
    // Calculate scores based on answers
    // This is a simplified scoring system for demonstration
    const visionQuestions = assessmentQuestions.filter(q => q.category === "vision");
    const physicalQuestions = assessmentQuestions.filter(q => q.category === "physical");
    const cognitiveQuestions = assessmentQuestions.filter(q => q.category === "cognitive");
    
    let visionScore = 0;
    let physicalScore = 0;
    let cognitiveScore = 0;
    
    visionQuestions.forEach(q => {
      const answer = answers[assessmentQuestions.indexOf(q)];
      if (answer === "no" || answer === "last6months" || answer === "yes_always" || answer === "easily") {
        visionScore += 3;
      } else if (answer === "sometimes" || answer === "last2years" || answer === "limited") {
        visionScore += 2;
      } else if (answer === "often" || answer === "over2years" || answer === "yes_sometimes" || answer === "difficulty") {
        visionScore += 1;
      }
    });
    
    physicalQuestions.forEach(q => {
      const answer = answers[assessmentQuestions.indexOf(q)];
      if (answer === "easily" || answer === "no" || answer === "excellent") {
        physicalScore += 3;
      } else if (answer === "limited" || answer === "mild" || answer === "good") {
        physicalScore += 2;
      } else if (answer === "difficulty" || answer === "moderate" || answer === "limited") {
        physicalScore += 1;
      }
    });
    
    cognitiveQuestions.forEach(q => {
      const answer = answers[assessmentQuestions.indexOf(q)];
      if (answer === "never" || answer === "excellent" || answer === "no") {
        cognitiveScore += 3;
      } else if (answer === "occasionally" || answer === "good" || answer === "rarely") {
        cognitiveScore += 2;
      } else if (answer === "sometimes" || answer === "average" || answer === "sometimes") {
        cognitiveScore += 1;
      }
    });
    
    // Normalize scores to 0-100
    const normalizedVisionScore = Math.round((visionScore / (visionQuestions.length * 3)) * 100);
    const normalizedPhysicalScore = Math.round((physicalScore / (physicalQuestions.length * 3)) * 100);
    const normalizedCognitiveScore = Math.round((cognitiveScore / (cognitiveQuestions.length * 3)) * 100);
    
    // Calculate overall score
    const overallScore = Math.round((normalizedVisionScore + normalizedPhysicalScore + normalizedCognitiveScore) / 3);
    
    setFitnessScore({
      vision: normalizedVisionScore,
      physical: normalizedPhysicalScore,
      cognitive: normalizedCognitiveScore,
      overall: overallScore
    });
    
    setIsAssessmentComplete(true);
    
    toast({
      title: "Assessment Complete",
      description: `Your driver fitness score is ${overallScore}%`,
    });
  };

  // Reset the assessment
  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsAssessmentComplete(false);
    setHealthConditions([]);
  };

  // Get score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  // Get progress color based on percentage
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Download or print the assessment
  const downloadAssessment = () => {
    toast({
      title: "Report Generated",
      description: "Your fitness assessment report is ready to download",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/rto-exam" className="mr-2">
            <ChevronLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Driver Fitness Assessment</h1>
        </div>

        {showIntro ? (
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 md:pr-6">
                <h2 className="text-lg font-semibold mb-4">Why Driver Fitness Matters</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Good physical and mental fitness is essential for safe driving. This self-assessment will help 
                  you identify potential concerns that might affect your driving ability. Complete all questions 
                  honestly for the most accurate results.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-md flex">
                    <Eye className="text-blue-500 h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">Vision</h3>
                      <p className="text-xs text-gray-600">Assesses your visual capabilities for driving</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md flex">
                    <Activity className="text-green-500 h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">Physical Fitness</h3>
                      <p className="text-xs text-gray-600">Evaluates coordination and mobility</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md flex">
                    <Brain className="text-purple-500 h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">Cognitive Function</h3>
                      <p className="text-xs text-gray-600">Assesses attention and decision-making</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Important Note</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        This assessment is only a self-screening tool, not a substitute for professional medical 
                        advice. If concerns are identified, please consult a healthcare provider.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowIntro(false)} 
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  Begin Assessment
                </Button>
              </div>
              <div className="mt-6 md:mt-0 md:w-1/3">
                <div className="bg-gray-50 p-4 rounded-md h-full">
                  <h3 className="font-medium mb-3">Do You Need This Assessment?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This fitness assessment is especially important if you:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Are over 65 years of age</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Have a medical condition that may affect driving</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Take medications that may cause drowsiness</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Have recently experienced changes in vision or mobility</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Want to ensure you're fit to drive safely</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ) : isAssessmentComplete ? (
          // Assessment Results
          <div>
            <Card className="p-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Driver Fitness Score</h2>
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-gray-100 mb-4">
                  <span className={`text-4xl font-bold ${getScoreColor(fitnessScore.overall)}`}>
                    {fitnessScore.overall}%
                  </span>
                </div>
                <p className="text-lg font-medium">
                  {fitnessScore.overall >= 80 ? 'Excellent Fitness' : 
                   fitnessScore.overall >= 60 ? 'Good Fitness' : 
                   fitnessScore.overall >= 40 ? 'Moderate Concerns' : 
                   'Significant Concerns'}
                </p>
                <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                  {fitnessScore.overall >= 80 ? 'You appear to have excellent driving fitness with minimal concerns.' : 
                   fitnessScore.overall >= 60 ? 'You have good overall fitness for driving with some areas to monitor.' : 
                   fitnessScore.overall >= 40 ? 'You should address several fitness concerns before driving.' : 
                   'Your results indicate significant concerns that should be addressed with a healthcare provider.'}
                </p>
              </div>
              
              <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Vision</span>
                    </div>
                    <span className={`font-medium ${getScoreColor(fitnessScore.vision)}`}>
                      {fitnessScore.vision}%
                    </span>
                  </div>
                  <Progress 
                    value={fitnessScore.vision} 
                    className={`h-2 ${getProgressColor(fitnessScore.vision)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {fitnessScore.vision >= 80 ? 'Excellent visual fitness for driving' : 
                     fitnessScore.vision >= 60 ? 'Good vision, but regular eye checks recommended' : 
                     fitnessScore.vision >= 40 ? 'Some visual concerns that should be addressed' : 
                     'Significant visual concerns - consult an eye care professional'}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Physical Fitness</span>
                    </div>
                    <span className={`font-medium ${getScoreColor(fitnessScore.physical)}`}>
                      {fitnessScore.physical}%
                    </span>
                  </div>
                  <Progress 
                    value={fitnessScore.physical} 
                    className={`h-2 ${getProgressColor(fitnessScore.physical)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {fitnessScore.physical >= 80 ? 'Excellent physical capability for driving tasks' : 
                     fitnessScore.physical >= 60 ? 'Good physical fitness with minor limitations' : 
                     fitnessScore.physical >= 40 ? 'Moderate physical concerns that may affect driving' : 
                     'Physical limitations that could significantly impact driving ability'}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-medium">Cognitive Function</span>
                    </div>
                    <span className={`font-medium ${getScoreColor(fitnessScore.cognitive)}`}>
                      {fitnessScore.cognitive}%
                    </span>
                  </div>
                  <Progress 
                    value={fitnessScore.cognitive} 
                    className={`h-2 ${getProgressColor(fitnessScore.cognitive)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {fitnessScore.cognitive >= 80 ? 'Excellent attention and decision-making ability' : 
                     fitnessScore.cognitive >= 60 ? 'Good cognitive function with some attention concerns' : 
                     fitnessScore.cognitive >= 40 ? 'Moderate cognitive concerns that should be addressed' : 
                     'Significant cognitive concerns - consult a healthcare provider'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={resetAssessment}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake Assessment
                </Button>
                <Button 
                  className="flex-1 bg-titeh-primary hover:bg-blue-600"
                  onClick={downloadAssessment}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
              
              {fitnessScore.vision < 70 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-md">
                  <div className="flex items-start">
                    <Eye className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Vision Recommendations</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Schedule a comprehensive eye examination with an optometrist or ophthalmologist.
                        Ensure you wear prescribed corrective lenses while driving.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {fitnessScore.physical < 70 && (
                <div className="mb-4 p-4 bg-green-50 rounded-md">
                  <div className="flex items-start">
                    <Activity className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Physical Fitness Recommendations</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Consider consulting a physical therapist about exercises to improve mobility and coordination.
                        Discuss any physical limitations with your doctor to determine if they affect your driving safety.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {fitnessScore.cognitive < 70 && (
                <div className="mb-4 p-4 bg-purple-50 rounded-md">
                  <div className="flex items-start">
                    <Brain className="text-purple-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Cognitive Function Recommendations</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Discuss any attention or focus concerns with your healthcare provider.
                        Review your medications to ensure they aren't affecting your alertness while driving.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {fitnessScore.overall < 50 && (
                <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
                  <div className="flex items-start">
                    <AlertTriangle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Important Health Notice</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Your assessment indicates significant concerns that may affect your driving safety.
                        We strongly recommend consulting a healthcare provider before continuing to drive.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4 p-4 bg-amber-50 rounded-md">
                <div className="flex items-start">
                  <Info className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Next Steps</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      Based on your assessment results, consider the following actions:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {fitnessScore.overall >= 80 ? (
                        <>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span>Continue your regular driving routine</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span>Maintain your health with regular check-ups</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span>Re-assess your fitness annually or if health status changes</span>
                          </li>
                        </>
                      ) : fitnessScore.overall >= 60 ? (
                        <>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Schedule a comprehensive health check-up</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Address specific concerns identified in your assessment</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Consider limiting driving to daylight hours or familiar routes</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <span>Consult with your healthcare provider before continuing to drive</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <span>Consider alternative transportation options temporarily</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <span>Request a professional driving assessment from an RTO-certified evaluator</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Recommendations
              </Button>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start">
                <HeartPulse className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Fitness Assessment Disclaimer</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This assessment provides general guidance only and does not constitute medical advice.
                    The results should be discussed with healthcare professionals who can provide personalized
                    recommendations based on your specific health conditions.
                  </p>
                  <Separator className="my-3" />
                  <p className="text-sm text-gray-600">
                    In most states, physicians are legally required to report certain medical conditions that may 
                    impair driving ability to the RTO. Self-reporting is also encouraged for maintaining road safety.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Assessment Questions
          <div>
            <Card className="p-6 mb-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</p>
                  <Badge 
                    className={`${
                      assessmentQuestions[currentQuestionIndex].category === 'vision' 
                        ? 'bg-blue-100 text-blue-800' : 
                      assessmentQuestions[currentQuestionIndex].category === 'physical' 
                        ? 'bg-green-100 text-green-800' : 
                      assessmentQuestions[currentQuestionIndex].category === 'cognitive' 
                        ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {assessmentQuestions[currentQuestionIndex].category.charAt(0).toUpperCase() + 
                     assessmentQuestions[currentQuestionIndex].category.slice(1)}
                  </Badge>
                </div>
                <Progress 
                  value={((currentQuestionIndex + 1) / assessmentQuestions.length) * 100} 
                  className="h-2" 
                />
              </div>
              
              <h2 className="text-lg font-medium mb-6">{assessmentQuestions[currentQuestionIndex].question}</h2>
              
              <RadioGroup value={answers[currentQuestionIndex]} className="space-y-4 mb-6">
                {assessmentQuestions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`option-${index}`} 
                      onClick={() => handleAnswerSelect(option.value)}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestionIndex]}
                  className="bg-titeh-primary hover:bg-blue-600"
                >
                  {currentQuestionIndex < assessmentQuestions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Complete Assessment'
                  )}
                </Button>
              </div>
            </Card>
            
            {currentQuestionIndex === assessmentQuestions.length - 1 && (
              <Card className="p-6 mb-6">
                <h3 className="font-medium mb-4">Do you have any of these conditions?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select all medical conditions that apply to you. This information helps provide more accurate recommendations.
                </p>
                
                <div className="space-y-3 mb-6">
                  {healthConditionsList.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2 p-3 border rounded-md">
                      <Checkbox 
                        id={condition.id} 
                        checked={healthConditions.includes(condition.id)}
                        onCheckedChange={() => toggleHealthCondition(condition.id)}
                      />
                      <label htmlFor={condition.id} className="text-sm cursor-pointer flex-1">
                        {condition.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-md">
                  <Switch 
                    id="medical-disclosure" 
                    checked={true}
                    disabled
                  />
                  <label htmlFor="medical-disclosure" className="text-sm cursor-pointer">
                    I understand that my health information is confidential and will only be used to provide personalized recommendations.
                  </label>
                </div>
              </Card>
            )}
            
            <Card className="p-6">
              <div className="flex items-start">
                <FileText className="text-titeh-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Answer Honestly</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Remember, this assessment is for your personal use to help identify potential concerns.
                    Honest answers will provide the most accurate and helpful results.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FitnessAssessment;
