import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, Clock, Flame, ArrowUpRight, ArrowRight, 
  ListChecks, RefreshCw, Heart, Timer, HelpCircle,
  BarChart3
} from 'lucide-react';
import WorkoutPlanGenerator from './components/WorkoutPlanGenerator';
import ExerciseCard from './components/ExerciseCard';

const WorkoutTab = ({ userData = {}, healthMetrics = {} }) => {
  const [activeDay, setActiveDay] = useState('day1');
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  
  // Handle workout plan generated from the WorkoutPlanGenerator
  const handleWorkoutPlanGenerated = (generatedPlan) => {
    setWorkoutPlan(generatedPlan);
    // Reset to day1 when a new plan is generated
    setActiveDay('day1');
  };
  
  // Helper function to get main muscle groups for display
  const getMainMuscleGroups = (dayPlan) => {
    // Get all unique muscle groups from exercises
    const allMuscleGroups = dayPlan.exercises.flatMap(ex => ex.muscleGroups);
    const uniqueGroups = [...new Set(allMuscleGroups)];
    
    // Get top 3 most frequent groups
    const counts = {};
    allMuscleGroups.forEach(group => {
      counts[group] = (counts[group] || 0) + 1;
    });
    
    const sortedGroups = uniqueGroups.sort((a, b) => counts[b] - counts[a]);
    const topGroups = sortedGroups.slice(0, 3);
    
    return topGroups.join(', ');
  };
  
  // Helper function to calculate time efficiency
  const getTimeEfficiency = (dayPlan) => {
    const durationMinutes = parseInt(dayPlan.duration) || 40;
    const totalSets = dayPlan.metrics.totalSets;
    
    // Calculate sets per minute (excluding warmup/cooldown time)
    const mainWorkoutTime = durationMinutes - 5; // Subtract warmup/cooldown estimate
    const setsPerMinute = (totalSets / mainWorkoutTime).toFixed(1);
    
    return `${setsPerMinute} sets/min`;
  };
  
  // Calculate main workout duration
  const calculateMainWorkoutDuration = (dayPlan) => {
    const totalDuration = parseInt(dayPlan.duration) || 40;
    const warmupTime = Math.ceil(dayPlan.warmup.length * 0.75);
    const cooldownTime = Math.ceil(dayPlan.cooldown.length * 0.5);
    
    return totalDuration - warmupTime - cooldownTime;
  };

  // If no workout plan yet, show the generator
  if (!workoutPlan) {
    return <WorkoutPlanGenerator 
      userData={userData} 
      healthMetrics={healthMetrics} 
      onWorkoutPlanGenerated={handleWorkoutPlanGenerated} 
    />;
  }
  
  // Find active day
  const activeDayPlan = workoutPlan.days.find(day => day.id === activeDay) || workoutPlan.days[0];
  
  // Toggle exercise details
  const toggleExerciseDetails = (exerciseIndex) => {
    if (expandedExercise === exerciseIndex) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise(exerciseIndex);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Workout Summary Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-[#e72208] w-full"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-[#e72208]" />
                Workout Overview
              </CardTitle>
              <CardDescription>
                Personalized fitness plan based on your goals and preferences
              </CardDescription>
            </div>
            <Badge className="bg-[#e72208]">Active Plan</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Workout Schedule</h4>
                <div className="flex flex-wrap gap-2">
                  {workoutPlan.days.map((day, index) => (
                    <div key={index} className="flex-1 min-w-[100px]">
                      <div 
                        className={`text-center p-2 rounded-md cursor-pointer transition-colors ${
                          activeDay === day.id 
                            ? 'bg-[#e72208] bg-opacity-10 border border-[#e72208] text-[#e72208]' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveDay(day.id)}
                      >
                        <p className="text-xs font-medium">{day.dayName}</p>
                        <p className="text-[11px] text-gray-600">{day.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Today's Focus</span>
                  <Badge variant="outline" className="bg-[#e72208] bg-opacity-10 text-[#e72208] border-[#e72208] border-opacity-20">
                    {activeDayPlan.focus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    {activeDayPlan.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exercises</span>
                  <span>{activeDayPlan.exercises.length} exercises</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sets</span>
                  <span>{activeDayPlan.metrics.totalSets} sets</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Workout Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-600">Est. Calories</span>
                    <Flame className="h-4 w-4 text-[#e72208]" />
                  </div>
                  <p className="text-xl font-bold text-[#e72208]">{activeDayPlan.metrics.estimatedCalories}</p>
                  <p className="text-[11px] text-gray-500">Based on duration and intensity</p>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-600">Volume</span>
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                  </div>
                  <p className="text-xl font-bold text-orange-500">
                    {activeDayPlan.metrics.totalSets * activeDayPlan.metrics.avgReps}
                  </p>
                  <p className="text-[11px] text-gray-500">Total reps across all sets</p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-600">Target Areas</span>
                    <Dumbbell className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="font-medium text-blue-600 text-sm">
                    {getMainMuscleGroups(activeDayPlan)}
                  </p>
                  <p className="text-[11px] text-gray-500">Primary muscle focus</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-600">Time Efficiency</span>
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="font-medium text-green-600">
                    {getTimeEfficiency(activeDayPlan)}
                  </p>
                  <p className="text-[11px] text-gray-500">Sets per minute</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Workout Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold flex items-center">
              <ListChecks className="h-5 w-5 mr-2 text-[#e72208]" />
              {activeDayPlan.dayName}: {activeDayPlan.focus} Workout
            </CardTitle>
          </div>
          <CardDescription className="pt-1">
            Complete {activeDayPlan.exercises.length} exercises in {activeDayPlan.duration}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-1">
          {/* Warmup Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Heart className="h-4 w-4 mr-1 text-pink-500" />
              Warm-up ({Math.ceil(activeDayPlan.warmup.length * 0.75)} minutes)
            </h3>
            <div className="bg-pink-50 p-3 rounded-md">
              <ul className="space-y-2">
                {activeDayPlan.warmup.map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main Workout */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Dumbbell className="h-4 w-4 mr-1 text-[#e72208]" />
              Main Workout ({calculateMainWorkoutDuration(activeDayPlan)} minutes)
            </h3>
            
            <div className="space-y-4">
              {activeDayPlan.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={index}
                  exercise={exercise}
                  index={index}
                  isExpanded={expandedExercise === index}
                  onToggle={() => toggleExerciseDetails(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Cooldown */}
          <div className="mb-2">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Timer className="h-4 w-4 mr-1 text-blue-500" />
              Cool-down ({Math.ceil(activeDayPlan.cooldown.length * 0.5)} minutes)
            </h3>
            <div className="bg-blue-50 p-3 rounded-md">
              <ul className="space-y-2">
                {activeDayPlan.cooldown.map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progression Guidelines Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-bold flex items-center">
            <ArrowRight className="h-5 w-5 mr-2 text-[#e72208]" />
            Progression Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-700">{workoutPlan.progressionNotes}</p>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-start">
              <HelpCircle className="h-4 w-4 mr-2 text-[#e72208] mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">When to Increase Intensity</h4>
                <p className="text-xs text-gray-600 mt-1">
                  If you can complete all sets at the upper end of the rep range with proper form for two consecutive workouts, it's time to increase the challenge.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <HelpCircle className="h-4 w-4 mr-2 text-[#e72208] mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Rest and Recovery</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Allow 48 hours of recovery between training the same muscle groups. Ensure you're getting 7-9 hours of sleep and staying properly hydrated.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <HelpCircle className="h-4 w-4 mr-2 text-[#e72208] mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Maintaining Proper Form</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Focus on quality over quantity. It's better to do fewer reps with proper form than more reps with poor form. This prevents injury and ensures optimal muscle engagement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <button 
            onClick={() => setWorkoutPlan(null)} 
            className="text-[#e72208] font-medium text-sm hover:underline flex items-center"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Regenerate Workout Plan
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkoutTab;