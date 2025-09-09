import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import { Tooltip as ReactTooltip} from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import {AppWrap, MotionWrap} from '../../wrapper';
import {urlFor, client} from '../../client'
import './Skills.scss';


const Skills = () => {
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const query = '*[_type == "experiences"]';
    const skillsQuery = '*[_type == "skills"]';

    client.fetch(query)
      .then((data) => {
        console.log(data);
        setExperience(data);
      })

    client.fetch(skillsQuery)
    .then((data) => {
      setSkills(data);
    })

  }, [])

  return (
    <>
      <h2 className='head-text'> Skills and Experience</h2>

      <div className='app__skills-container'>
        <motion.div className='app__skills-list'>
          {skills?.map((skill) => (
            <motion.div
              whileInView={{opacity: [0, 1]}}
              transition={{duration: 0.5}}
              className='app__skills-item app__flex'
              key={skill.name}
            >
              <div className='app__flex' style={{backgroundColor: skill.bgColor}}>
                <img src={urlFor(skill.icon)} alt={skill.name}/>
              </div>

              <p className='p-text'>
                {skill.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className='app__skills-exp'>   
          {[...experience]
            .sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10))
            .map((exp) => (
              <motion.div
                className='app__skills-exp-item'
                key={exp.year}
              >
                <div className='app__skills-exp-year'>
                  <p className='bold-text'>
                    {exp.year}
                  </p>
                </div>    
                <motion.div className='app__skills-exp-works'>
                    {exp.works.map((work) => (
                      <React.Fragment key={work.name}>
                        <motion.div 
                          whileInView={{opacity: [0, 1]}}
                          transition={{duration: 0.5}}
                          className='app__skills-exp-work'
                          data-tooltip-id={work.name}
                        >
                          <h4 className='bold-text'>
                            {work.name}
                          </h4>

                          <p className='p-text'>
                            {work.company}
                          </p>
                        </motion.div>
                    
                        <ReactTooltip
                          id={work.name}
                          effect="solid"
                          arrowColor="#fff"
                          className='skills-tooltip'
                          globalCloseEvents={{ resize: true }}
                        >
                          {work.desc}
                        </ReactTooltip>
                      </React.Fragment>
                    ))}
                </motion.div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </>
  )
}

export default AppWrap(
  MotionWrap(Skills, 'app__skills'), 
  'skills',
  "app__whitebg"
);
