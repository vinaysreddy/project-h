import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Apple, 
  Scale, 
  Goal, 
  Zap, 
  CalendarClock, 
  Info, 
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

const OverviewTab = ({ userData = {}, healthMetrics = {}, projectedWeightData = [], workoutRecommendation = {} }) => {
  // Destructure with default values to prevent errors
  const { 
    bmi = 0, 
    bmiCategory = 'Unknown', 
    calorieTarget = 2000,
    successProbability = 0.75,
    weightUnit = 'kg'
  } = healthMetrics || {};

  // Simulate plans status (this should be replaced with actual data)
  const hasDietPlan = false;
  const hasWorkoutPlan = false;
  const hasWeightGoal = !!userData?.targetWeight;
  const setupCompletion = calculateSetupCompletion(userData, hasDietPlan, hasWorkoutPlan);
  
  return (
    <div className="space-y-8">
      {/* Profile Completion Banner */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center">
                <Info className="h-5 w-5 mr-2 text-[#4D55CC]" />
                Complete Your Health Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Finish setting up to get personalized recommendations tailored just for you.
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile completion</span>
                <span className="font-medium">{setupCompletion}%</span>
              </div>
              <Progress value={setupCompletion} className="h-2">
                <div className="h-full bg-[#4D55CC] rounded-full"></div>
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Plan Card */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-[#e72208] w-full"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2 text-[#e72208]" />
                  Workout Plan
                </CardTitle>
                <CardDescription>
                  Personalized exercise routine based on your goals
                </CardDescription>
              </div>
              {hasWorkoutPlan ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge className="bg-amber-500">Action Needed</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasWorkoutPlan ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Your workout plan is active</span>
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Today's Workout</span>
                    <span className="text-xs bg-[#e72208] text-white px-2 py-0.5 rounded-full">45 min</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upper Body Focus: Chest, Shoulders, Triceps
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <Info className="h-4 w-4" />
                  <span>You haven't created a workout plan yet</span>
                </div>
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Dumbbell className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    Generate a personalized workout plan based on your goals and fitness level
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            {hasWorkoutPlan ? (
              <button className="w-full px-4 py-2 bg-[#e72208] text-white rounded-md mt-2 flex items-center justify-center">
                View Workout Plan <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button className="w-full px-4 py-2 bg-[#e72208] text-white rounded-md mt-2 flex items-center justify-center">
                Create Workout Plan <PlusCircle className="ml-2 h-4 w-4" />
              </button>
            )}
          </CardFooter>
        </Card>

        {/* Diet Plan Card */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-[#3E7B27] w-full"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Apple className="h-5 w-5 mr-2 text-[#3E7B27]" />
                  Nutrition Plan
                </CardTitle>
                <CardDescription>
                  Customized eating plan for your nutrition goals
                </CardDescription>
              </div>
              {hasDietPlan ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge className="bg-amber-500">Action Needed</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasDietPlan ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Your nutrition plan is active</span>
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Daily Target</span>
                    <span className="text-xs bg-[#3E7B27] text-white px-2 py-0.5 rounded-full">{calorieTarget} calories</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Balanced macros with emphasis on protein for muscle maintenance
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <Info className="h-4 w-4" />
                  <span>You haven't created a nutrition plan yet</span>
                </div>
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Apple className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    Get a tailored nutrition plan with meal suggestions and calorie targets
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            {hasDietPlan ? (
              <button className="w-full px-4 py-2 bg-[#3E7B27] text-white rounded-md mt-2 flex items-center justify-center">
                View Nutrition Plan <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button className="w-full px-4 py-2 bg-[#3E7B27] text-white rounded-md mt-2 flex items-center justify-center">
                Create Nutrition Plan <PlusCircle className="ml-2 h-4 w-4" />
              </button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {/* Weight Goal Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-[#4D55CC] w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold flex items-center">
                <Scale className="h-5 w-5 mr-2 text-[#4D55CC]" />
                Weight Goal
              </CardTitle>
              <CardDescription>
                {hasWeightGoal 
                  ? `Your target: ${userData.targetWeight} ${userData.weightUnit || weightUnit}`
                  : 'Set a weight goal to track your progress'
                }
              </CardDescription>
            </div>
            {hasWeightGoal ? (
              <Badge className="bg-[#4D55CC]">
                {userData.targetWeight > userData.weight ? 'Gain' : 'Loss'}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500 text-amber-500">Not Set</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasWeightGoal ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="text-2xl font-bold">{userData.weight} {userData.weightUnit || weightUnit}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#4D55CC] flex items-center justify-center">
                    <div className="text-lg font-bold">
                      {Math.abs(userData.targetWeight - userData.weight)} 
                      <span className="text-xs block">{userData.weightUnit || weightUnit}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="text-2xl font-bold">{userData.targetWeight} {userData.weightUnit || weightUnit}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Estimated time to goal</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-[#4D55CC]" />
                    12 weeks
                  </span>
                </div>
                <Progress value={25} className="h-2">
                  <div className="h-full bg-[#4D55CC] rounded-full"></div>
                </Progress>
                <p className="text-xs text-muted-foreground text-right">
                  25% complete - Started 3 weeks ago
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              <Scale className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-2">
                Setting a target weight helps us create more effective workout and nutrition plans
              </p>
              <button className="px-4 py-2 bg-[#4D55CC] text-white rounded-md mt-2 flex items-center justify-center">
                Set Weight Goal <PlusCircle className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-gray-700" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!hasWorkoutPlan && (
              <div className="flex items-start gap-4 p-3 border rounded-md">
                <div className="bg-[#e72208] bg-opacity-10 p-2 rounded-full">
                  <Dumbbell className="h-5 w-5 text-[#e72208]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Create your workout plan</h3>
                  <p className="text-sm text-muted-foreground">Generate a personalized workout routine based on your goals and fitness level</p>
                  <button className="text-sm px-4 py-1.5 mt-2 bg-[#e72208] text-white rounded-md flex items-center">
                    Create Now <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {!hasDietPlan && (
              <div className="flex items-start gap-4 p-3 border rounded-md">
                <div className="bg-[#3E7B27] bg-opacity-10 p-2 rounded-full">
                  <Apple className="h-5 w-5 text-[#3E7B27]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Create your nutrition plan</h3>
                  <p className="text-sm text-muted-foreground">Get a customized meal plan with healthy recipes and portion guidance</p>
                  <button className="text-sm px-4 py-1.5 mt-2 bg-[#3E7B27] text-white rounded-md flex items-center">
                    Create Now <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {!hasWeightGoal && (
              <div className="flex items-start gap-4 p-3 border rounded-md">
                <div className="bg-[#4D55CC] bg-opacity-10 p-2 rounded-full">
                  <Scale className="h-5 w-5 text-[#4D55CC]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Set a weight goal</h3>
                  <p className="text-sm text-muted-foreground">Define a target weight to help track your progress over time</p>
                  <button className="text-sm px-4 py-1.5 mt-2 bg-[#4D55CC] text-white rounded-md flex items-center">
                    Set Goal <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {hasWorkoutPlan && hasDietPlan && hasWeightGoal && (
              <div className="flex items-start gap-4 p-3 border rounded-md bg-green-50">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">You're all set!</h3>
                  <p className="text-sm text-muted-foreground">Your profile is complete. Continue following your workout and nutrition plans to achieve your goals.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to calculate setup completion percentage
function calculateSetupCompletion(userData, hasDietPlan, hasWorkoutPlan) {
  let total = 0;
  let completed = 0;
  
  // Basic profile
  total += 1;
  if (userData?.name && userData?.height && userData?.weight) completed += 1;
  
  // Weight goal
  total += 1;
  if (userData?.targetWeight) completed += 1;
  
  // Workout plan
  total += 1;
  if (hasWorkoutPlan) completed += 1;
  
  // Diet plan
  total += 1;
  if (hasDietPlan) completed += 1;
  
  return Math.round((completed / total) * 100);
}

export default OverviewTab;