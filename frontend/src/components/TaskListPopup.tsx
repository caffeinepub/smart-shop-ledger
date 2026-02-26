import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Plus, Check, Trash2, AlertCircle } from 'lucide-react';
import BottomSheet from './BottomSheet';
import PremiumModal from './PremiumModal';
import { playBell } from '../utils/sounds';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TaskListPopupProps {
  open: boolean;
  onClose: () => void;
}

const FREE_ITEM_LIMIT = 199;

export default function TaskListPopup({ open, onClose }: TaskListPopupProps) {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const isBn = language === 'bn';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const holdTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (open) loadTasks();
  }, [open]);

  const loadTasks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('tasks') || '[]');
      setTasks(Array.isArray(saved) ? saved : []);
    } catch {
      setTasks([]);
    }
  };

  const saveTasks = (newTasks: Task[]) => {
    try {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch {}
  };

  const handleAdd = () => {
    if (!newTask.trim()) return;

    if (!isPremium && tasks.length >= FREE_ITEM_LIMIT) {
      setShowPremiumModal(true);
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    setNewTask('');
  };

  const handleHoldStart = (id: string) => {
    holdTimers.current[id] = setTimeout(() => {
      const updated = tasks.map(t => t.id === id ? { ...t, completed: true } : t);
      setTasks(updated);
      saveTasks(updated);
      playBell();
      if (navigator.vibrate) navigator.vibrate(200);
    }, 2000);
  };

  const handleHoldEnd = (id: string) => {
    if (holdTimers.current[id]) {
      clearTimeout(holdTimers.current[id]);
      delete holdTimers.current[id];
    }
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const nearLimit = !isPremium && tasks.length >= 190 && tasks.length < FREE_ITEM_LIMIT;
  const atLimit = !isPremium && tasks.length >= FREE_ITEM_LIMIT;

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title={isBn ? 'কাজের তালিকা' : 'Task List'}>
        <div className="flex flex-col h-full px-4 py-3">
          {/* Near limit warning */}
          {nearLimit && (
            <div className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 text-xs">
                {isBn ? `${FREE_ITEM_LIMIT - tasks.length}টি কাজ আর যোগ করতে পারবেন` : `${FREE_ITEM_LIMIT - tasks.length} tasks remaining`}
              </p>
            </div>
          )}

          {/* Add input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={isBn ? 'নতুন কাজ লিখুন...' : 'Add new task...'}
              className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${
                isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:border-amber-500`}
            />
            <button
              onClick={handleAdd}
              disabled={atLimit}
              className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>

          {/* Tasks */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {tasks.length === 0 ? (
              <p className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {isBn ? 'কোনো কাজ নেই' : 'No tasks yet'}
              </p>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  onMouseDown={() => handleHoldStart(task.id)}
                  onMouseUp={() => handleHoldEnd(task.id)}
                  onTouchStart={() => handleHoldStart(task.id)}
                  onTouchEnd={() => handleHoldEnd(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all select-none ${
                    task.completed
                      ? isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                      : isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.completed ? 'bg-green-500 border-green-500' : isDark ? 'border-gray-500' : 'border-gray-300'
                  }`}>
                    {task.completed && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`flex-1 text-sm ${
                    task.completed
                      ? isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                      : isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {task.text}
                  </span>
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onTouchStart={e => e.stopPropagation()}
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <p className={`text-xs text-center mt-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {isBn ? '২ সেকেন্ড ধরে রাখুন সম্পন্ন করতে' : 'Hold 2 seconds to complete'}
          </p>
        </div>
      </BottomSheet>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={() => setShowPremiumModal(false)}
      />
    </>
  );
}
