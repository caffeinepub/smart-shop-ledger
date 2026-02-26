import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from './BottomSheet';
import { playBell } from '../utils/sounds';
import { Plus, Trash2 } from 'lucide-react';

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

const STORAGE_KEY = 'smart_shop_tasks';

function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const TaskListPopup: React.FC<TaskListPopupProps> = ({ open, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [holdingId, setHoldingId] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [confettiIds, setConfettiIds] = useState<string[]>([]);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) setTasks(loadTasks());
  }, [open]);

  const addTask = () => {
    if (!newTask.trim()) return;
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

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const startHold = (id: string) => {
    if (tasks.find(t => t.id === id)?.completed) return;
    setHoldingId(id);
    setHoldProgress(0);
    let progress = 0;
    progressTimer.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(progressTimer.current!);
      }
    }, 100);
    holdTimer.current = setTimeout(() => {
      completeTask(id);
    }, 2000);
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);
    setHoldingId(null);
    setHoldProgress(0);
  };

  const completeTask = (id: string) => {
    setHoldingId(null);
    setHoldProgress(0);
    playBell();
    if (navigator.vibrate) navigator.vibrate([200]);
    setConfettiIds(prev => [...prev, id]);
    setTimeout(() => setConfettiIds(prev => prev.filter(cid => cid !== id)), 2000);
    const updated = tasks.map(t => t.id === id ? { ...t, completed: true } : t);
    setTasks(updated);
    saveTasks(updated);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <BottomSheet open={open} onClose={onClose} title="📋 কাজের তালিকা">
      <div className="px-4 py-3">
        {/* Add task input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="নতুন কাজ লিখুন..."
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm border border-gray-600 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={addTask}
            className="bg-green-600 text-white rounded-xl px-4 py-2.5 font-bold hover:bg-green-500"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Progress info */}
        <div className="text-xs text-gray-400 mb-3 text-center">
          ✅ {completedTasks.length}/{tasks.length} সম্পন্ন • ২ সেকেন্ড ধরে রাখুন সম্পন্ন করতে
        </div>

        {/* Pending tasks */}
        {pendingTasks.length === 0 && completedTasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📝</div>
            <p>কোনো কাজ নেই। নতুন কাজ যোগ করুন!</p>
          </div>
        )}

        {pendingTasks.map(task => (
          <div
            key={task.id}
            className={`relative mb-3 rounded-2xl border overflow-hidden transition-all duration-300 ${
              holdingId === task.id
                ? 'border-green-400 shadow-lg shadow-green-500/30'
                : 'border-gray-700'
            } ${confettiIds.includes(task.id) ? 'animate-pulse' : ''}`}
            style={{ background: holdingId === task.id ? 'rgba(34,197,94,0.1)' : 'rgba(31,41,55,1)' }}
          >
            {/* Hold progress bar */}
            {holdingId === task.id && (
              <div
                className="absolute top-0 left-0 h-1 bg-green-400 transition-all duration-100"
                style={{ width: `${holdProgress}%` }}
              />
            )}
            <div
              className="flex items-center justify-between p-4 select-none cursor-pointer"
              onPointerDown={() => startHold(task.id)}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
            >
              <div className="flex-1">
                <p className="text-white font-medium">{task.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {holdingId === task.id ? `⏳ ${Math.round(holdProgress / 50 * 1)}/${2} সেকেন্ড...` : '👆 ধরে রাখুন ২ সেকেন্ড'}
                </p>
              </div>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={() => deleteTask(task.id)}
                className="ml-3 text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 mt-4">
              সম্পন্ন কাজ
            </div>
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="mb-2 rounded-2xl border border-gray-800 bg-gray-800/50 p-4 flex items-center justify-between opacity-60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✅</span>
                  <p className="text-gray-400 line-through text-sm">{task.text}</p>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-400/60 hover:text-red-400 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </BottomSheet>
  );
};

export default TaskListPopup;
