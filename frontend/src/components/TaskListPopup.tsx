import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import BottomSheet from './BottomSheet';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { playBell } from '../utils/sounds';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskListPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function TaskListPopup({ open, onClose }: TaskListPopupProps) {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const { showNotification } = useNotificationContext();
  const isDark = mode === 'dark';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const holdIntervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('taskList');
      if (stored) { try { setTasks(JSON.parse(stored)); } catch { /* ignore */ } }
    }
  }, [open]);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem('taskList', JSON.stringify(updated));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [...tasks, { id: Date.now().toString(), text: newTask.trim(), completed: false }];
    saveTasks(updated);
    setNewTask('');
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const startHold = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgressMap(prev => ({ ...prev, [id]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
        delete holdIntervals.current[id];
        completeTask(id);
      }
    }, 100);
    holdIntervals.current[id] = interval;
  };

  const endHold = (id: string) => {
    if (holdIntervals.current[id]) {
      clearInterval(holdIntervals.current[id]);
      delete holdIntervals.current[id];
    }
    setProgressMap(prev => ({ ...prev, [id]: 0 }));
  };

  const completeTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: true } : t);
    saveTasks(updated);
    playBell();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    showNotification(t('taskCompleted'));
  };

  const textPrimary = isDark ? '#ffffff' : '#1a1a1a';
  const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : '#f8f9fa';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';

  return (
    <BottomSheet open={open} onClose={onClose} title={t('taskList')}>
      <div className="px-4 pb-6">
        {/* Add task input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder={`${t('addItem')}...`}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#22c55e' }}
          >
            <Plus size={18} color="#fff" />
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs mb-3 text-center" style={{ color: textSecondary }}>
          ২ সেকেন্ড ধরে রাখুন কাজ সম্পন্ন করতে
        </p>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: textSecondary }}>
            কোনো কাজ নেই। নতুন কাজ যোগ করুন!
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const progress = progressMap[task.id] || 0;
              return (
                <div
                  key={task.id}
                  className="relative rounded-xl px-4 py-3 flex items-center gap-3 overflow-hidden select-none"
                  style={{
                    background: task.completed
                      ? (isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'),
                    border: `1px solid ${task.completed ? 'rgba(34,197,94,0.3)' : cardBorder}`,
                    cursor: task.completed ? 'default' : 'pointer',
                  }}
                  onMouseDown={() => startHold(task.id)}
                  onMouseUp={() => endHold(task.id)}
                  onMouseLeave={() => endHold(task.id)}
                  onTouchStart={() => startHold(task.id)}
                  onTouchEnd={() => endHold(task.id)}
                >
                  {/* Progress fill */}
                  {progress > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'rgba(34,197,94,0.15)',
                        width: `${progress}%`,
                        transition: 'width 0.1s linear',
                      }}
                    />
                  )}

                  <CheckCircle2
                    size={20}
                    color={task.completed ? '#22c55e' : textSecondary}
                    fill={task.completed ? 'rgba(34,197,94,0.2)' : 'none'}
                  />
                  <span
                    className="flex-1 text-sm"
                    style={{
                      color: task.completed ? '#22c55e' : textPrimary,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.7 : 1,
                    }}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-1.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)' }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
