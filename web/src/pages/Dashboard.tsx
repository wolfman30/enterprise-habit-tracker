import React, { useEffect, useState } from 'react';
import { Habit, HabitEntry } from '../types';
import * as db from '../services/db';
import HabitCard from '../components/HabitCard';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple date formatter for YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const loadData = async () => {
    // Seed data on first load
    db.seedData();
    
    const h = await db.getHabits();
    // Filter out archived habits
    setHabits(h.filter(x => !x.archived).sort((a,b) => a.order - b.order));
    
    const e = await db.getEntries(today, today);
    setEntries(e);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const progress = habits.length > 0 
    ? Math.round((habits.filter(h => {
        const entry = entries.find(e => e.habit_id === h.id);
        return entry && entry.value >= h.target_value;
      }).length / habits.length) * 100)
    : 0;

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Today</h2>
        <p className="text-slate-500">{todayDisplay}</p>
        
        {/* Progress Bar */}
        <div className="mt-4 h-4 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400 font-medium">
           <span>{progress}% Completed</span>
           <span>{habits.length} Habits</span>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 animate-pulse">
          Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-2">No habits defined yet.</p>
          <a href="#/habits" className="text-blue-600 font-medium hover:underline">Create your first habit</a>
        </div>
      ) : (
        <div className="space-y-1 pb-20">
          {habits.map(habit => (
            <HabitCard 
              key={habit.id}
              habit={habit}
              date={today}
              todayEntry={entries.find(e => e.habit_id === habit.id)}
              onUpdate={loadData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;