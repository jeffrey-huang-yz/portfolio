import React, { useMemo } from 'react';
import { SectionShell } from '../../component';
import './Skills.scss';

const Skills = ({ experiences, skills }) => {
  const sortedExperience = useMemo(
    () => [...experiences].sort((a, b) => Number(b.year) - Number(a.year)),
    [experiences],
  );

  return (
    <SectionShell
      id="skills"
      eyebrow="Toolkit / experience"
      title="Tools change. The habit of learning doesn’t."
      intro="A practical toolkit shaped by product work, automation, data, design, and the occasional rocket."
      className="skills-section"
      pageIndex={3}
    >
      <div className="skills-layout">
        <div className="skill-cloud">
          <h3>Working set</h3>
          <ul aria-label="Technical skills">
            {skills.map((skill) => <li key={skill._id || skill.name}>{skill.name}</li>)}
          </ul>
        </div>

        <div className="experience-trail">
          <h3>Experience trail</h3>
          <ol>
            {sortedExperience.map((experience) => (
              <li key={experience._id || experience.year}>
                <time dateTime={experience.year}>{experience.year}</time>
                <div>
                  {experience.works?.map((work) => (
                    <article key={work._key || `${experience.year}-${work.name}`}>
                      <h4>{work.name}</h4>
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
