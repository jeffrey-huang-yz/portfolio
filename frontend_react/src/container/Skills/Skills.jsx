import React, { useMemo } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../../component';
import './Skills.scss';

const detailViewport = { once: true, amount: 0.25, margin: '0px 0px -16% 0px' };
const timelineSequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const timelineLine = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } },
};
const timelineDot = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};
const timelineYear = {
  hidden: { opacity: 0, x: -11 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Skills = ({ experiences, skills }) => {
  const reduceMotion = useReducedMotion();
  const sortedExperience = useMemo(
    () => [...experiences].sort((a, b) => Number(b.year) - Number(a.year)),
    [experiences],
  );
  return (
    <SectionShell
      id="skills"
      title="Experiences"
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
        </div>

        <div className="experience-trail">
          <ol>
            {sortedExperience.map((experience) => (
              <m.li
                key={experience._id || experience.year}
                variants={timelineSequence}
                initial={reduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={detailViewport}
              >
                <m.span
                  className="experience-trail__line"
                  aria-hidden="true"
                  variants={timelineLine}
                />
                <m.span
                  className="experience-trail__dot"
                  aria-hidden="true"
                  variants={timelineDot}
                />
                <m.time variants={timelineYear} dateTime={experience.year}>
                  {experience.year}
                </m.time>
                <div>
                  {experience.works?.map((work) => (
                    <article key={work._key || `${experience.year}-${work.name}`}>
                      <h3>{work.name}</h3>
                      <p className="experience-trail__company">{work.company}</p>
                      <p>{work.desc}</p>
                    </article>
                  ))}
                </div>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
};

export default Skills;
