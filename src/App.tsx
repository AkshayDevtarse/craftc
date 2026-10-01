import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LearnLayout } from '@/layouts/LearnLayout';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const CoursePage = lazy(() => import('@/pages/CoursePage').then((m) => ({ default: m.CoursePage })));
const LessonPage = lazy(() => import('@/pages/LessonPage').then((m) => ({ default: m.LessonPage })));
const RoadmapsPage = lazy(() => import('@/pages/RoadmapsPage').then((m) => ({ default: m.RoadmapsPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const InterviewPrepPage = lazy(() => import('@/pages/InterviewPrepPage').then((m) => ({ default: m.InterviewPrepPage })));
const CheatsheetsPage = lazy(() => import('@/pages/CheatsheetsPage').then((m) => ({ default: m.CheatsheetsPage })));
const DownloadsPage = lazy(() => import('@/pages/DownloadsPage').then((m) => ({ default: m.DownloadsPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const CertificatePage = lazy(() => import('@/pages/CertificatePage').then((m) => ({ default: m.CertificatePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/craftc">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/roadmaps" element={<MainLayout><RoadmapsPage /></MainLayout>} />
          <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
          <Route path="/interview-prep" element={<MainLayout><InterviewPrepPage /></MainLayout>} />
          <Route path="/cheatsheets" element={<MainLayout><CheatsheetsPage /></MainLayout>} />
          <Route path="/downloads" element={<MainLayout><DownloadsPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/learn/:courseId" element={<LearnLayout><CoursePage /></LearnLayout>} />
          <Route path="/learn/:courseId/:lessonSlug" element={<LearnLayout><LessonPage /></LearnLayout>} />
          <Route path="/certificate/:courseId" element={<MainLayout><CertificatePage /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
