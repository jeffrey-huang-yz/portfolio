import React from 'react';
import './About.scss';
import { SectionShell } from '../../component';

const interestNotes = ['Basketball', 'Working out', 'Fashion', 'Music'];
const capabilityMarks = ['WEB', 'UX', 'SYS'];

const About = ({ abouts }) => {
  return (
    <SectionShell
      id="about"
      eyebrow="Profile / how I work"
      title="A software builder with a visual point of view."
      intro="I move comfortably from interface details to the systems behind them, keeping the experience coherent all the way through."
      className="about-section"
      pageIndex={1}
    >
      <div className="capability-list">
        {abouts.map((about, index) => (
          <article className="capability" key={about._id || about.title}>
            <span className="capability__mark" aria-hidden="true">{capabilityMarks[index] || 'DEV'}</span>
            <h3>{about.title}</h3>
            <p>{about.description}</p>
          </article>
        ))}
      </div>

      <aside className="interest-note" aria-labelledby="interest-note-title">
        <p id="interest-note-title" className="eyebrow">What keeps the work human</p>
        <ul>
          {interestNotes.map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
        <p>Different rhythms, the same instinct: observe, adjust, find the clean line.</p>
      </aside>
    </SectionShell>
  );
};

export default About;
