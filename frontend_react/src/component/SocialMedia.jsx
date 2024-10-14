import React from 'react'
import {BsInstagram} from 'react-icons/bs';
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

/* Higher order components */
const SocialMedia = () => {
  return (
    <div className='app__social'>
      <div>
        <a href='https://www.linkedin.com/in/jeffrey-huang-yz' target="_blank" rel="noreferrer noopener">
          <FaLinkedin />
        </a> 
      </div>

      <div>
        <a href='https://github.com/jeffrey-huang-yz' target="_blank" rel="noreferrer noopener">
          <FaGithub />
        </a>  
      </div>

      <div >
        <a href='https://www.instagram.com/jeffrxyh/' target="_blank" rel="noreferrer noopener">  
          <BsInstagram />
        </a>
      </div>
      
    </div>
  )
}

export default SocialMedia