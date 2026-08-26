import React, { useMemo } from 'react';
import { SectionShell } from '../../component';
import './Skills.scss';

const buildLoopSteps = ['frontend', 'full-stack', 'product', 'qa'];

const ExperienceRegister = ({ years }) => (
  <div
    className="experience-register"
    style={{ '--experience-count': Math.max(years.length, 1) }}
    aria-hidden="true"
  >
    <span className="experience-register__line" />
    {years.map((year) => (
      <span
        className="experience-register__year"
        key={year}
      >
        <span className="experience-register__pin" />
        <span>{year}</span>
      </span>
    ))}
  </div>
);

const BuildLoop = () => (
  <aside className="build-loop" aria-labelledby="build-loop-title">
    <header className="build-loop__heading">
      <h3 id="build-loop-title">Build loop</h3>
      <span aria-hidden="true">01—04 / repeat</span>
    </header>
    <div className="build-loop__diagram">
      <svg
        viewBox="0 0 320 220"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M72 54H248V166H72C40 166 40 54 72 54Z" />
      </svg>
      <ol>
        {buildLoopSteps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </div>
  </aside>
);

const Skills = ({ experiences, skills }) => {
  const sortedExperience = useMemo(
    () => [...experiences].sort((a, b) => Number(b.year) - Number(a.year)),
    [experiences],
  );
  const chronologicalYears = [...sortedExperience]
    .reverse()
    .map((experience) => experience.year);

  return (
    <SectionShell
      id="skills"
      title="Experiences"
      headingVisual={(
        <ExperienceRegister years={chronologicalYears} />
      )}
      className="skills-section"
      pageIndex={3}
    >
      <div className="skills-layout">
        <div className="skills-sidebar">
          <div className="skill-cloud">
            <h3>Skills</h3>
            <ul aria-label="Technical skills">
              {skills.map((skill) => <li key={skill._id || skill.name}>{skill.name}</li>)}
            </ul>
          </div>
          <BuildLoop />
        </div>

        <div className="experience-trail">
          <ol>
            {sortedExperience.map((experience) => (
              <li key={experience._id || experience.year}>
                <span
                  className="experience-trail__line"
                  aria-hidden="true"
                />
                <span
                  className="experience-trail__dot"
                  aria-hidden="true"
                />
                <time dateTime={experience.year}>{experience.year}</time>
                <div>
                  {experience.works?.map((work) => (
                    <article key={work._key || `${experience.year}-${work.name}`}>
                      <h3>{work.name}</h3>
                      <p className="experience-trail__company">{work.company}</p>
                      <p>{work.desc}</p>
                    </article>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
};

export default Skills;
