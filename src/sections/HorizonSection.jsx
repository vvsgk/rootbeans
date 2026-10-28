import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { MILESTONES } from '../data/milestones.js';

export default function HorizonSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitEmail = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="horizon" id="updates" aria-labelledby="horizon-title">
      <div className="section-wrap">
        <p className="eyebrow">THE HORIZON</p>
        <h2 id="horizon-title">Two years in<br />the making.</h2>
        <p>We are not rushing the beginning. Our ambition is to launch Root Beans in October 2028, subject to product quality, production readiness and applicable food-business requirements.</p>
        <div className="milestones">
          {MILESTONES.map((milestone, index) => (
            <article className={`milestone reveal ${milestone.state === 'current' ? 'milestone-real' : ''}`} key={milestone.date} style={{ '--reveal-delay': `${index * 90}ms` }}>
              <span>{milestone.date}</span>
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
            </article>
          ))}
        </div>
        <form className="follow-form" onSubmit={submitEmail}>
          <div>
            <p className="eyebrow">FOLLOW THE JOURNEY · OCCASIONAL UPDATES</p>
            <p>Notes from the growing space, experiments and the road to launch.</p>
          </div>
          <div className="follow-input">
            <input type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }} placeholder="Your email address" aria-label="Your email address" />
            <button type="submit">{submitted ? 'THANK YOU' : 'FOLLOW THE JOURNEY'} <ArrowRight size={14} /></button>
          </div>
          {submitted && <p className="success-note">Thank you. This prototype confirms the form interaction locally. Connect an email provider before collecting real subscribers.</p>}
        </form>
      </div>
    </section>
  );
}
