import type { Curriculum } from '@/types';
import { getAllLessons } from '@/utils/curriculum';

const STORAGE_KEY = 'craftc:completed-lessons';

function readProgress(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Record<string, string[]> : {};
  } catch {
    return {};
  }
}

export function getCompletedLessons(courseId: string): string[] {
  return readProgress()[courseId] ?? [];
}

export function markLessonComplete(courseId: string, lessonSlug: string): string[] {
  const progress = readProgress();
  const completed = new Set(progress[courseId] ?? []);
  completed.add(lessonSlug);
  progress[courseId] = [...completed];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress[courseId];
}

export function getCourseProgress(curriculum: Curriculum): { completed: number; total: number; isComplete: boolean } {
  const total = getAllLessons(curriculum).length;
  const completed = getCompletedLessons(curriculum.id).length;
  return { completed: Math.min(completed, total), total, isComplete: total > 0 && completed >= total };
}
