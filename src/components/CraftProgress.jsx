import { ArrowUpRight } from 'lucide-react';

export default function CraftProgress({ steps, navigate }) {
  return (
    <div className="craft-list">
      {steps.map((step, index) => (
        <button
          className={`craft-row reveal ${step.state === 'current' ? 'craft-row-current' : ''}`}
          key={step.number}
          style={{ '--reveal-delay': `${index * 70}ms` }}
          onClick={() => navigate('/journey')}
          aria-label={`Explore ${step.title} in the Root Beans journey`}
        >
          <span>{step.number}</span>
          <div>
            <h3>{step.title}</h3>
            <p><strong>{step.status}</strong> · {step.detail}</p>
          </div>
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
