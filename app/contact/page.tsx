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
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84]">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#171714] font-normal">
            Contact Us
          </h1>
          <p className="font-serif italic text-lg text-[#6E6A61]">
            Have feedback, questions, or partnership ideas? We&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-white border border-[#8A9B84]/40 rounded-[2px] text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#8A9B84] mx-auto" />
            <h2 className="font-serif text-2xl text-[#171714]">Message Sent</h2>
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
              <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#6E6A61] font-sans font-medium">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={`w-full min-h-11 px-3 border bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84] ${errors.name ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.name && <p className="text-xs text-[#B76546]">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-[#6E6A61] font-sans font-medium">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full min-h-11 px-3 border bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84] ${errors.email ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.email && <p className="text-xs text-[#B76546]">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#6E6A61] font-sans font-medium">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className={`w-full min-h-[120px] px-3 py-2 border bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84] resize-none ${errors.message ? 'border-[#B76546]' : 'border-[#DCD5C9]'}`}
              />
              {errors.message && <p className="text-xs text-[#B76546]">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="gap-2">
                <Send className="w-4 h-4" />
                SEND MESSAGE
              </Button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
