import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BarChart3, ChevronRight, BookOpen } from 'lucide-react';
import { cCurriculum } from '@/data/cCurriculum';
import { cppCurriculum } from '@/data/cppCurriculum';
import type { Curriculum } from '@/types';
import { findLessonBySlug } from '@/utils/curriculum';
import { LessonSectionRender } from '@/components/LessonSectionRender';
import { Badge } from '@/components/ui';
import { getAllLessons } from '@/utils/curriculum';
import { getCompletedLessons, markLessonComplete } from '@/utils/progress';

function getCurriculum(id: string): Curriculum | null {
  if (id === 'c') return cCurriculum;
  if (id === 'cpp') return cppCurriculum;
  return null;
}

export function LessonPage() {
  const { courseId, lessonSlug } = useParams();
  const curriculum = courseId ? getCurriculum(courseId) : null;
  const found = curriculum && lessonSlug ? findLessonBySlug(curriculum, lessonSlug) : null;

  if (!curriculum || !found) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Lesson not found</h1>
      </div>
    );
  }

  const { lesson, category } = found;
  const [completed, setCompleted] = useState(false);
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(false);

  useEffect(() => {
    setCompleted(getCompletedLessons(curriculum.id).includes(lesson.slug));
  }, [curriculum.id, lesson.slug]);

  function handleMarkComplete() {
    const completedSlugs = markLessonComplete(curriculum.id, lesson.slug);
    setCompleted(true);
    const allLessons = getAllLessons(curriculum);
    if (allLessons.length > 0 && allLessons.every(item => completedSlugs.includes(item.lesson.slug))) {
      setShowCertificatePrompt(true);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <nav className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6 flex-wrap">
          <span className="text-[var(--color-text-secondary)]">{curriculum.title}</span>
          <ChevronRight size={14} />
          <span className="text-[var(--color-text-secondary)]">{category.title}</span>
          <ChevronRight size={14} />
          <span className="text-[var(--color-text)] truncate">{lesson.title}</span>
        </nav>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant={lesson.difficulty === 'beginner' ? 'success' : lesson.difficulty === 'intermediate' ? 'warning' : 'error'}>
            {lesson.difficulty}
          </Badge>
          <Badge variant="primary">{curriculum.language === 'c' ? 'C' : 'C++'}</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] leading-tight">{lesson.title}</h1>
        <p className="mt-3 text-lg text-[var(--color-text-secondary)] leading-relaxed">{lesson.description}</p>

        <div className="flex items-center gap-4 mt-4 text-sm text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5"><Clock size={15} /> {lesson.duration}</span>
          <span className="flex items-center gap-1.5"><BarChart3 size={15} /> {lesson.difficulty}</span>
          <span className="flex items-center gap-1.5"><BookOpen size={15} /> {lesson.sections.length} sections</span>
        </div>
      </motion.div>

      <div className="mt-10 lesson-prose">
        {lesson.sections.map((section, index) => (
          <LessonSectionRender key={index} section={section} index={index} />
        ))}
      </div>
    </div>
  );
}
