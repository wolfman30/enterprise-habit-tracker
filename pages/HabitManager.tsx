import React, { useEffect, useState } from 'react';
import { Habit, HabitFrequency } from '../types';
import * as db from '../services/db';
import { Icons } from '../constants';

const HabitManager: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Habit>>({});

  const loadHabits = async () => {
    const data = await db.getHabits();
    setHabits(data.filter(h => !h.archived));
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleCreate = () => {
    setFormData({
      name: '',
      target_value: 1,
      unit: 'times',
      frequency: HabitFrequency.DAILY,
      order: habits.length
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_value) return;

    const newHabit: Habit = {
      id: formData.id || crypto.randomUUID(),
      user_id: 'user1',
      name: formData.name,
      description: formData.description || '',
      target_value: Number(formData.target_value),
      unit: formData.unit || 'times',
      frequency: formData.frequency || HabitFrequency.DAILY,
      archived: false,
      order: formData.order || 0,
      created_at: formData.created_at || new Date().toISOString()
    };

    await db.saveHabit(newHabit);
    setIsEditing(false);
    loadHabits();
  };

  const handleArchive = async (id: string) => {
     if(!confirm("Are you sure you want to archive this habit?")) return;
     const habit = habits.find(h => h.id === id);
     if (habit) {
       await db.saveHabit({ ...habit, archived: true });
       loadHabits();
     }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6">{formData.id ? 'Edit Habit' : 'New Habit'}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Morning Jog"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
               <input 
                 type="number" 
                 required
                 min="1"
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.target_value || ''}
                 onChange={e => setFormData({...formData, target_value: parseInt(e.target.value)})}
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.unit || ''}
                 onChange={e => setFormData({...formData, unit: e.target.value})}
                 placeholder="e.g. mins"
               />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
             <button 
               type="button" 
               onClick={() => setIsEditing(false)}
               className="flex-1 px-4 py-2 text-slate-700 font-medium bg-slate-100 rounded-lg hover:bg-slate-200"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               className="flex-1 px-4 py-2 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700"
             >
               Save Habit
             </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manage Habits</h2>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Icons.Plus /> New
        </button>
      </div>

      <div className="space-y-3">
        {habits.map(habit => (
          <div key={habit.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
            <div>
              <h3 className="font-semibold text-slate-800">{habit.name}</h3>
              <p className="text-sm text-slate-500">
                 Goal: {habit.target_value} {habit.unit} / {habit.frequency}
              </p>
            </div>
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => { setFormData(habit); setIsEditing(true); }}
                 className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
               >
                 Edit
               </button>
               <button 
                 onClick={() => handleArchive(habit.id)}
                 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
               >
                 <Icons.Archive />
               </button>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
           <div className="text-center text-slate-400 py-10">
             No active habits. Create one to get started!
           </div>
        )}
      </div>
    </div>
  );
};

export default HabitManager;