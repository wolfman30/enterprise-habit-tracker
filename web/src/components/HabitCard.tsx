import React, { useState, useCallback } from 'react';
import { Habit, HabitEntry } from '../types';
import { Icons } from '../constants';
import * as db from '../services/db';

interface HabitCardProps {
  habit: Habit;
  todayEntry?: HabitEntry;
  date: string;
  onUpdate: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, todayEntry, date, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const currentVal = todayEntry?.value || 0;
  const isCompleted = currentVal >= habit.target_value;

  const handleIncrement = useCallback(async () => {
    setLoading(true);
    const newVal = currentVal + 1;
    await db.saveEntry({
      id: todayEntry?.id || `${habit.id}_${date}`,
      habit_id: habit.id,
      date: date,
      value: newVal,
      synced: false
    });
    setLoading(false);
    onUpdate();
  }, [currentVal, habit.id, date, todayEntry, onUpdate]);
  
  const handleDecrement = useCallback(async () => {
    if (currentVal <= 0) return;
    setLoading(true);
    const newVal = currentVal - 1;
    await db.saveEntry({
      id: todayEntry?.id || `${habit.id}_${date}`,
      habit_id: habit.id,
      date: date,
      value: newVal,
      synced: false
    });
    setLoading(false);
    onUpdate();
  }, [currentVal, habit.id, date, todayEntry, onUpdate]);

  return (
    <div className={`relative flex items-center justify-between p-4 mb-3 rounded-xl border shadow-sm transition-all duration-200 
      ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
      
      <div className="flex-1 min-w-0 pr-4">
        <h3 className={`font-semibold text-lg truncate ${isCompleted ? 'text-green-800' : 'text-slate-800'}`}>
          {habit.name}
        </h3>
        <p className="text-xs text-slate-500 truncate">
          Target: {habit.target_value} {habit.unit}
        </p>
      </div>

      <div className="flex items-center gap-3">
         {/* Counter controls */}
         <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button 
              onClick={handleDecrement}
              disabled={loading || currentVal === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 active:scale-95 disabled:opacity-50"
            >
              -
            </button>
            <div className="w-10 text-center font-mono font-medium text-slate-700">
               {currentVal}
            </div>
            <button 
              onClick={handleIncrement}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-blue-600 active:scale-95 disabled:opacity-50"
            >
              +
            </button>
         </div>

         {/* Checkmark indicator */}
         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
           ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-200'}`}>
            <Icons.Check />
         </div>
      </div>
    </div>
  );
};

export default HabitCard;