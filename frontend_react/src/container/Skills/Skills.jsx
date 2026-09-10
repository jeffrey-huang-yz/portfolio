import React, { useMemo } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { SectionShell } from '../../component';
import { motionEase, detailViewport } from '../../motion';
import './Skills.scss';

const timelineSequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const timelineLine = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.68, ease: motionEase } },
};
const timelineDot = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: motionEase } },
};
const timelineYear = {
  hidden: { opacity: 0, x: -11 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: motionEase } },
};

const skillCategories = {
  'interface': ['javascript', 'typescript', 'react', 'html', 'css', 'sass'],
  'backend & APIs': ['nodejs', 'node.js', 'python', 'flask', 'c++', 'axios'],
  'data & AI': ['rasa', 'pandas', 'regex', 'mongodb', 'mysql'],
  'tools & platforms': ['git', 'figma', 'azure'],
};

const Skills = ({ experiences, skills }) => {
  const reduceMotion = useReducedMotion();
  const groups = skills.reduce((result, skill) => {
    const group = Object.keys(skillCategories).find((key) => skillCategories[key].includes(skill.name.trim().toLowerCase())) || 'more tools';
    (result[group] ||= []).push(skill);
    return result;
  }, {});
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
        <aside className="skills-sidebar" aria-labelledby="skills-index-title">
          <div className="skills-index">
            <h3 id="skills-index-title" className="skills-index__label">skills</h3>
            <div className="skills-index__groups">
              {[...Object.keys(skillCategories), 'more tools'].filter((group) => groups[group]?.length).map((group) => <div className="skill-group" key={group}>
                <div className="skill-group__heading">
                  <h4>{group}</h4>
                  <span className="skill-group__count" aria-label={`${groups[group].length} skills`}>{String(groups[group].length).padStart(2, '0')}</span>
                </div>
                <ul aria-label={group}>{groups[group].map((skill) => <li key={skill._id || skill.name}>{skill.name}</li>)}</ul>
              </div>)}
            </div>
          </div>
        </aside>

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
