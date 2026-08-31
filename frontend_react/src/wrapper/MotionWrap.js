import React from 'react';
import { m } from 'framer-motion';

const MotionWrap = (Component, classNames) => function HOC() {
  return (
    <m.div
      whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
      transition={{ duration: 0.5 }}
      className={`${classNames} app__flex`}
    >
      <Component />
    </m.div>
  );
};

export default MotionWrap;
