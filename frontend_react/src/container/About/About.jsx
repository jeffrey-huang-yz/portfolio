import React from 'react';
import './About.scss';
import { SectionShell } from '../../component';

const interestNotes = ['Basketball', 'Working out', 'Fashion', 'Music', 'Collecting TCG'];
const capabilityMarks = ['WEB', 'UX', 'SYS'];

const northAmericaMap = String.raw`       ⢀⡀ ⢀⢀⣄⡀⢀⡀
  ⠠⠠⢤⢀⠄⡠⡠⡈⢕⣔⡀⢀⡤⠠
 ⠈⠆⠣⡢⠂⠤⢭⣀⠰⣭ ⡉⠰⠅
       ⠡⡜ ⢌⠡⢀⡤⡈⢣⠖⡠
         ⢸⡀⢁ ⢁⠋ ⡄⠄⢔⠍
          ⠈⠠⡀⡢⢇⠢⠠⠔⠁
             ⠆⠄ ⡀⠈⠅
             ⠉⠘⠒⠂`;

const asiaMap = String.raw`            ⢀      ⠤⡀
   ⢠⣠⠄⠖⢰⠞⠘⠦⠐⡠⠐⠆⠒⡤⠤⠄
   ⢨⠈⠠⢅⠠⠂ ⠵⠅⡣⠍⠊⠅⢃⢛⠠⠅
    ⣤⡤⠬⡜⡌⢅⡀⡢⢥⣀ ⠁⠉⣠⢜⠐
⣠⣠⡴⠤⠔⢡ ⢇ ⢰⠠⠄ ⡆⠐⠂
 ⠠⠓⣂⠅⣀⠄⢡ ⢀⡀⣎⡠⠂
      ⠈⢀⠅⢀⠉⠙⠪⠖⠨⠶⢪⠐
         ⠁⠊⠁  ⢂⠁
                    ⠆⢀⠴ ⡈
                       ⠙⠈⠈`;

const profileMapVisual = (
  <div className="profile-map" aria-hidden="true">
    <pre className="profile-map__continent">{northAmericaMap}</pre>
    <span className="profile-map__label">˖ ࣪ ⋆ profile ⋆ ࣪ ˖</span>
    <pre className="profile-map__continent profile-map__continent--asia">{asiaMap}</pre>
  </div>
);

const CapabilitySchematic = ({ type }) => {
  if (type === 'UX') {
    return (
      <svg className="capability__schematic" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
        <path className="capability__measure" d="M40 14v12m0-6h168m0-6v12M24 34h12m-6 0v84m-6 0h12" />
        <rect x="40" y="34" width="168" height="84" />
        <rect x="58" y="52" width="61" height="48" />
        <path d="M136 53h54M136 68h40M136 83h48M136 98h31" />
        <circle cx="40" cy="34" r="4" />
        <circle cx="208" cy="34" r="4" />
        <circle cx="40" cy="118" r="4" />
        <circle cx="208" cy="118" r="4" />
        <path className="capability__cursor" d="M190 87l27 28-13 1-7 12z" />
      </svg>
    );
  }

  if (type === 'SYS') {
    return (
      <svg className="capability__schematic" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
        <path className="capability__flow" d="M42 75h52m72 0h52M130 34v19m0 44v19" />
        <circle cx="30" cy="75" r="12" />
        <circle cx="230" cy="75" r="12" />
        <circle cx="130" cy="22" r="12" />
        <circle cx="130" cy="128" r="12" />
        <rect x="94" y="53" width="72" height="44" />
        <path d="M105 64h50M105 75h50M105 86h50" />
        <path className="capability__port" d="M24 72h12M124 19h12M224 72h12M124 125h12" />
      </svg>
    );
  }

  return (
    <svg className="capability__schematic" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
      <rect x="22" y="22" width="216" height="106" />
      <path d="M22 45h216" />
      <circle className="capability__dot" cx="35" cy="34" r="2.5" />
      <circle className="capability__dot" cx="45" cy="34" r="2.5" />
      <circle className="capability__dot" cx="55" cy="34" r="2.5" />
      <path className="capability__guide" d="M42 52v67M218 52v67" />
      <rect x="42" y="59" width="112" height="39" />
      <rect x="165" y="59" width="53" height="39" />
      <path d="M42 108h176M42 117h72M123 117h44M176 117h42" />
    </svg>
  );
};

const About = ({ abouts }) => (
  <SectionShell
    id="about"
    title="A software builder with a mindset for design and performance"
    intro="I care about the point where engineering decisions, brand identity, and everyday usability meet."
    headingVisual={profileMapVisual}
    className="about-section"
    pageIndex={1}
  >
    <div className="capability-list">
      {abouts.map((about, index) => {
        const mark = capabilityMarks[index] || 'DEV';

        return (
          <div
            className="capability-reveal"
            key={about._id || about.title}
          >
            <article className={`capability capability--${mark.toLowerCase()}`}>
              <span className="capability__mark" aria-hidden="true">{mark}</span>
              <h3>{about.title}</h3>
              <p>{about.description}</p>
              <CapabilitySchematic type={mark} />
            </article>
          </div>
        );
      })}
    </div>

    <aside
      className="interest-note"
      aria-labelledby="interest-note-title"
    >
      <p id="interest-note-title" className="eyebrow">Interests</p>
      <ul>
        {interestNotes.map((interest) => <li key={interest}>{interest}</li>)}
      </ul>
    </aside>
  </SectionShell>
);

export default About;
