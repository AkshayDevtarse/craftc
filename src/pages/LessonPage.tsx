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

  const [completed, setCompleted] = useState(false);
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);

  useEffect(() => {
    if (!curriculum || !found) {
      setCompleted(false);
      setCourseComplete(false);
      setShowCertificatePrompt(false);
      return;
    }

    const completedSlugs = getCompletedLessons(curriculum.id);
    const allLessons = getAllLessons(curriculum);
    const isLessonComplete = completedSlugs.includes(found.lesson.slug);
    const isCourseComplete =
      allLessons.length > 0 &&
      completedSlugs.length >= allLessons.length &&
      allLessons.every((item) => completedSlugs.includes(item.lesson.slug));

    setCompleted(isLessonComplete);
    setCourseComplete(isCourseComplete);

    if (isCourseComplete) {
      setShowCertificatePrompt(true);
    }
  }, [curriculum?.id, found?.lesson.slug]);

  if (!curriculum || !found) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Lesson not found</h1>
      </div>
    );
  }

  const { lesson, category } = found;

  function handleMarkComplete() {
    const completedSlugs = markLessonComplete(curriculum.id, lesson.slug);
    setCompleted(true);
    const allLessons = getAllLessons(curriculum);
    const isCourseComplete =
      allLessons.length > 0 &&
      completedSlugs.length >= allLessons.length &&
      allLessons.every((item) => completedSlugs.includes(item.lesson.slug));

    setCourseComplete(isCourseComplete);
    if (isCourseComplete) {
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

      <div className="mt-12 border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[var(--color-text)]">Lesson progress</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{completed ? 'This lesson is marked complete on this device.' : 'Mark this lesson complete when you finish studying it.'}</p>
        </div>
        <button onClick={handleMarkComplete} className="rounded-xl px-5 py-3 font-semibold bg-[var(--color-primary)] text-white hover:opacity-90">{completed ? 'Completed ✓' : 'Mark lesson complete'}</button>
      </div>

      {courseComplete && !showCertificatePrompt && (
        <div className="mt-6 rounded-2xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">🎉 Course Completed!</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Your certificate is ready. Get your verified certificate for ₹99.</p>
          </div>
          <Link to={`/certificate/${curriculum.id}`} className="inline-flex justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white">Get Certified · ₹99</Link>
        </div>
      )}

      {showCertificatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="certificate-prompt-title">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl">
            <h2 id="certificate-prompt-title" className="text-2xl font-bold">Course completed! 🎉</h2>
            <p className="text-[var(--color-text-secondary)] mt-3">You have completed every lesson in {curriculum.title}. You can now request your certificate.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to={`/certificate/${curriculum.id}`} className="rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white">Get Certified · ₹99</Link>
              <button onClick={() => setShowCertificatePrompt(false)} className="rounded-xl border border-[var(--color-border)] px-4 py-3">Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
