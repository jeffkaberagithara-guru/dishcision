'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim()) newErrors.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (!message.trim()) newErrors.message = 'Please enter your message.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-2xl space-y-8">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#8A9B84]">Get in touch</span>
          <h1 className="font-hero text-4xl md:text-6xl text-[#171714]">Contact Us</h1>
          <p className="font-serif italic text-xl text-[#6E6A61]">
            Have feedback, questions, or partnership ideas? We&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="card-modern p-10 text-center space-y-4">
            <div className="grid place-items-center size-16 rounded-2xl bg-[#8A9B84]/12 text-[#54684E] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-hero text-2xl text-[#171714]">Message Sent</h2>
            <p className="text-sm text-[#6E6A61] max-w-sm mx-auto">
              Thank you for reaching out. We&apos;ll get back to you at <span className="font-medium text-[#171714]">{email}</span> as soon as possible.
            </p>
            <Button variant="outline" size="md" onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-sm font-medium text-[#171714]">Name</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={`w-full min-h-12 px-4 border bg-white text-base rounded-xl focus:outline-none focus:border-[#8A9B84] focus:ring-4 focus:ring-[#8A9B84]/10 ${errors.name ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.name && <p className="text-xs text-[#B76546]">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-sm font-medium text-[#171714]">Email</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full min-h-12 px-4 border bg-white text-base rounded-xl focus:outline-none focus:border-[#8A9B84] focus:ring-4 focus:ring-[#8A9B84]/10 ${errors.email ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.email && <p className="text-xs text-[#B76546]">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="block text-sm font-medium text-[#171714]">Message</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className={`w-full min-h-[130px] px-4 py-3 border bg-white text-base rounded-xl focus:outline-none focus:border-[#8A9B84] focus:ring-4 focus:ring-[#8A9B84]/10 resize-none ${errors.message ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.message && <p className="text-xs text-[#B76546]">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="gap-2">
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
