import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Habit, HabitEntry } from '../types';
import * as db from '../services/db';
import { getHabitInsights } from '../services/geminiService';
import { Icons } from '../constants';

const Reports: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const h = await db.getHabits();
      setHabits(h.filter(x => !x.archived));
      
      // Calculate last 7 days range
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      
      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];
      
      const entries = await db.getEntries(startDateStr, endDateStr);

      // Prepare chart data: Count of completed habits per day
      const chartData = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayEntries = entries.filter(e => e.date === dateStr);
        const completedCount = h.filter(habit => {
           const entry = dayEntries.find(e => e.habit_id === habit.id);
           return entry && entry.value >= habit.target_value;
        }).length;
        
        chartData.push({
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          completed: completedCount
        });
      }
      setWeeklyData(chartData);

      // Get AI Insights
      setLoadingAi(true);
      const insight = await getHabitInsights(h, entries);
      setAiInsight(insight);
      setLoadingAi(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Weekly Progress</h2>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={weeklyData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{fill: '#64748b', fontSize: 12}} 
                 dy={10}
                />
               <YAxis hide />
               <Tooltip 
                 cursor={{fill: '#f1f5f9'}} 
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
               />
               <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* AI Coach Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
         <div className="flex items-center gap-2 mb-4">
           <Icons.Sparkles />
           <h3 className="font-bold text-lg">AI Habit Coach</h3>
         </div>
         
         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-indigo-50 leading-relaxed text-sm min-h-[100px]">
            {loadingAi ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                <span>Analyzing your performance...</span>
              </div>
            ) : (
              <div className="whitespace-pre-line">
                {aiInsight}
              </div>
            )}
         </div>
         <p className="text-xs text-indigo-200 mt-3 opacity-70">
           Powered by Gemini API. Insights based on your last 7 days of logs.
         </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-3xl font-bold text-slate-800">{habits.length}</div>
             <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Active Habits</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-3xl font-bold text-green-600">85%</div>
             <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Completion Rate</div>
          </div>
      </div>
    </div>
  );
};

export default Reports;