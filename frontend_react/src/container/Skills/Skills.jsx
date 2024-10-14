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
          {skills?.map((skills) => (
            <motion.div
              whileInView={{opacity: [0, 1]}}
              transition={{duration: 0.5}}
              className='app__skills-item app__flex'
              key={skills.name}
            >
              <div className='app__flex' style={{backgroundColor: skills.bgColor}}>
                <img src={urlFor(skills.icon)} alt={skills.name}/>
              </div>

              <p className='p-text'>
                {skills.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className='app__skills-exp'>   
          {experience?.map((experience) => (
            <motion.div
              className='app__skills-exp-item'
              key={experience.year}
            >
              <div className='app__skills-exp-year'>
                <p className='bold-text'>
                  {experience.year}
                </p>
              </div>    
              <motion.div className='app__skills-exp-works'>
                  {experience.works.map((work) => (
                    <>
                      <motion.div 
                        whileInView={{opacity: [0, 1]}}
                        transition={{duration: 0.5}}
                        className='app__skills-exp-work'
                        data-tooltip-id={work.name}
                        key={work.name}
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
                    </>
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
