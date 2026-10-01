import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, ShieldCheck, Truck } from 'lucide-react';
import { cCurriculum } from '@/data/cCurriculum';
import { cppCurriculum } from '@/data/cppCurriculum';
import type { Curriculum } from '@/types';
import { getCourseProgress } from '@/utils/progress';

function getCurriculum(id: string): Curriculum | null {
  if (id === 'c') return cCurriculum;
  if (id === 'cpp') return cppCurriculum;
  return null;
}

export function CertificatePage() {
  const { courseId } = useParams();
  const curriculum = courseId ? getCurriculum(courseId) : null;
  const progress = curriculum ? getCourseProgress(curriculum) : null;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [delivery, setDelivery] = useState<'digital' | 'physical'>('digital');
  const [submitted, setSubmitted] = useState(false);

  if (!curriculum || !progress) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center"><h1 className="text-2xl font-bold">Course not found</h1><Link to="/" className="text-[var(--color-primary)] mt-4 inline-block">Go home</Link></div>;
  }

  if (!progress.isComplete) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center"><Award size={40} className="mx-auto text-[var(--color-primary)] mb-4" /><h1 className="text-2xl font-bold">Finish the course first</h1><p className="text-[var(--color-text-secondary)] mt-2">Complete all lessons to unlock your certificate.</p><Link to={`/learn/${courseId}`} className="inline-flex mt-6 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white">Return to course</Link></div>;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request = { fullName: fullName.trim(), email: email.trim(), courseId, courseTitle: curriculum.title, delivery, priceInr: 99, status: 'pending-payment', createdAt: new Date().toISOString() };
    const key = 'craftc:certificate-requests';
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as typeof request[];
    localStorage.setItem(key, JSON.stringify([...existing, request]));
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to={`/learn/${courseId}`} className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-8"><ArrowLeft size={16} /> Back to course</Link>
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-9">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-5"><Award size={28} className="text-[var(--color-primary)]" /></div>
        <h1 className="text-3xl font-bold">Get Certified</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">Congratulations on completing {curriculum.title}. Enter the name you want printed on your certificate.</p>
        <div className="grid sm:grid-cols-3 gap-3 my-7">
          <div className="rounded-xl border border-[var(--color-border)] p-4"><ShieldCheck className="text-[var(--color-primary)] mb-2" /><div className="font-semibold">Verified certificate</div><div className="text-xs text-[var(--color-text-muted)] mt-1">Verification features require server setup</div></div>
          <div className="rounded-xl border border-[var(--color-border)] p-4"><Award className="text-[var(--color-primary)] mb-2" /><div className="font-semibold">Digital copy</div><div className="text-xs text-[var(--color-text-muted)] mt-1">PDF certificate option</div></div>
          <div className="rounded-xl border border-[var(--color-border)] p-4"><Truck className="text-[var(--color-primary)] mb-2" /><div className="font-semibold">Physical copy</div><div className="text-xs text-[var(--color-text-muted)] mt-1">Printed and shipped option</div></div>
        </div>
        {submitted ? (
          <div className="rounded-2xl border border-[var(--color-primary)]/40 p-5">
            <h2 className="text-xl font-semibold">Request saved — payment not taken</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">Your request is stored in this browser as pending payment. Online payment, secure certificate issuance, QR verification, and physical shipping are not active until the server/payment provider is configured.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-[var(--color-primary)] underline">Edit details</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium">Full name for certificate<input required maxLength={100} value={fullName} onChange={e => setFullName(e.target.value)} className="mt-2 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3" placeholder="Your full name" /></label>
            <label className="block text-sm font-medium">Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3" placeholder="you@example.com" /></label>
            <fieldset><legend className="text-sm font-medium mb-2">Certificate delivery</legend><div className="grid sm:grid-cols-2 gap-3"><label className="rounded-xl border border-[var(--color-border)] p-4 flex gap-3 cursor-pointer"><input type="radio" name="delivery" checked={delivery === 'digital'} onChange={() => setDelivery('digital')} /><span><strong>Digital PDF</strong><span className="block text-sm text-[var(--color-text-muted)]">₹99</span></span></label><label className="rounded-xl border border-[var(--color-border)] p-4 flex gap-3 cursor-pointer"><input type="radio" name="delivery" checked={delivery === 'physical'} onChange={() => setDelivery('physical')} /><span><strong>Physical + digital</strong><span className="block text-sm text-[var(--color-text-muted)]">₹99 base price; shipping fee to be configured</span></span></label></div></fieldset>
            {delivery === 'physical' && <p className="text-sm text-[var(--color-text-secondary)]">Shipping address collection will be added with the secure checkout flow; no address is collected in this prototype.</p>}
            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5"><span className="text-[var(--color-text-secondary)]">Certificate fee <strong className="text-[var(--color-text)]">₹99</strong></span><button type="submit" className="rounded-xl bg-[var(--color-primary)] px-5 py-3 font-semibold text-white hover:opacity-90">Save request</button></div>
            <p className="text-xs text-[var(--color-text-muted)]">This is a request prototype, not a payment checkout. No money is charged and no certificate is issued from this screen.</p>
          </form>
        )}
      </div>
    </div>
  );
}
