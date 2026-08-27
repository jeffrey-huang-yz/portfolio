const imageReference = (ref) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: ref },
});

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Profile' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Experiences' },
  { id: 'contact', label: 'Contact' },
];

export const fallbackPortfolio = {
  abouts: [
    {
      _id: 'frontend-development',
      title: 'Frontend Development',
      description:
        'I excel in transforming designs into vibrant, interactive web experiences using HTML, CSS, and JavaScript. Passionate about crafting user-centric interfaces, I blend aesthetics with functionality to create responsive and engaging digital environments that prioritize user experience and accessibility.',
    },
    {
      _id: 'ui-ux-design',
      title: 'UI/UX Design',
      description:
        'I use Figma to create unique, aesthetically pleasing designs that prioritize intuitive user experiences. My approach blends innovative design concepts with user-centric principles, ensuring each project is visually engaging, seamlessly navigable, and accessible.',
    },
    {
      _id: 'backend-development',
      title: 'Backend Development',
      description:
        'My backend work focuses on robust databases and efficient server-client communication. I build scalable, secure systems with reliable data management and connectivity for strong application performance.',
    },
  ],
  works: [
    {
      _id: 'git-hired',
      imageSlug: 'git-hired',
      title: 'GitHired',
      description:
        'GitHub-based screening tool for automated profile analysis, resume parsing, and candidate relevancy ranking, reducing screening time significantly.',
      projectLink: 'https://justgitajoblol.compare/',
      codeLink: 'https://github.com/jeffrey-huang-yz/git-hired',
      tags: ['Website', 'React JS', 'All'],
      imgUrl: imageReference('image-753c3a25331db80d5b8c95ff0d26d3dd6ede8e9c-861x597-png'),
    },
    {
      _id: 'remembrance',
      imageSlug: 'remembrance',
      title: 'Remembrance',
      description:
        "Web app designed to evoke nostalgia by searching a user's Google Photos for images similar to one they upload.",
      codeLink: 'https://github.com/jeffrey-huang-yz/remembrance',
      tags: ['Website', 'React JS', 'All'],
      imgUrl: imageReference('image-5d8143ca486e72aa1cbfbd999aa88227a19f26ac-1916x939-png'),
    },
    {
      _id: 'diskovery',
      imageSlug: 'diskovery',
      title: 'diskovery — Spotify Music Recommender',
      description:
        'A full-stack music discovery platform built with React, Axios, Express.js, and MongoDB that helps people find songs using similar tracks and audio metrics.',
      projectLink: 'https://diskovery-ljvy.onrender.com/',
      codeLink: 'https://github.com/jeffrey-huang-yz/spotify-recommender',
      tags: ['Website', 'React JS', 'All'],
      imgUrl: imageReference('image-f592371ba682aae94c7b24da70e2c72d50f0d746-1105x994-png'),
    },
    {
      _id: 'portfolio',
      imageSlug: 'portfolio',
      title: 'Fullstack Portfolio',
      description: 'A dynamic full-stack website developed using a modern web stack.',
      projectLink: 'https://jeffreyhuang.me/',
      codeLink: 'https://github.com/jeffrey-huang-yz/portfolio',
      tags: ['Website', 'React JS', 'All'],
      imgUrl: imageReference('image-6fd86374243b000553975de7e379f76288ea6896-788x603-png'),
    },
    {
      _id: 'active-quest',
      imageSlug: 'active-quest',
      title: 'Active Quest',
      description:
        'Android fitness app designed to help users maximize their workouts and routines through gamification.',
      codeLink: 'https://github.com/Innovoak',
      tags: ['Mobile App', 'UI/UX', 'All'],
      imgUrl: imageReference('image-c56ceb00efbfd37e885cf3169385cb9b9b338c72-334x382-png'),
    },
    {
      _id: 'exam-exporter',
      imageSlug: 'exam-exporter',
      title: 'UW Exam Schedule Exporter',
      description:
        'A streamlined way for University of Waterloo students to manage and export their exam schedules.',
      codeLink: 'https://github.com/jeffrey-huang-yz/uw-exam-exporter',
      tags: ['React JS', 'All'],
      imgUrl: imageReference('image-c6160979ebbfbf3a92fbc7d058972660d5e788aa-339x354-png'),
    },
    {
      _id: 'login-register',
      imageSlug: 'login-register',
      title: 'Login and Registration Page',
      description:
        'Frontend views built with HTML, JavaScript, and CSS that send user input to Java Servlets, with JDBC handling storage in MySQL.',
      codeLink: 'https://github.com/jeffrey-huang-yz/LoginAndRegister',
      tags: ['All', 'Website'],
      imgUrl: imageReference('image-891aee8ca5618b999e210e530bf1b82bb52025f3-606x558-png'),
    },
    {
      _id: 'guess-who',
      imageSlug: 'guess-who',
      title: 'Guess Who',
      description:
        'An engaging Guess Who game that combines object-oriented programming principles with an intuitive GUI.',
      codeLink: 'https://github.com/jeffrey-huang-yz/guesswho',
      tags: ['All'],
      imgUrl: imageReference('image-8e9d43d7a5f4127b750fef8eaa10a75bfbe0cf36-595x653-png'),
    },
    {
      _id: 'automatic-diffuser',
      imageSlug: 'automatic-diffuser',
      title: 'Automated Essential Oil Diffuser',
      description:
        'An automated sleep aid combining an essential-oil diffuser with a Bluetooth heart-rate sensor to help improve sleep quality.',
      codeLink: 'https://github.com/jeffrey-huang-yz/automaticDiffuser',
      tags: ['All'],
      imgUrl: imageReference('image-7f0f5ef276ab6a2671e42f645a0f7e90102bb196-748x562-png'),
    },
  ],
  skills: [
    'JavaScript', 'Typescript', 'React', 'HTML', 'CSS', 'Sass', 'NodeJS',
    'Python', 'Flask', 'C++', 'Rasa', 'Axios', 'Pandas', 'RegEx', 'MongoDB',
    'MySQL', 'Git', 'Figma', 'Azure',
  ].map((name) => ({ _id: name.toLowerCase(), name })),
  experiences: [
    {
      _id: '2025',
      year: '2025',
      works: [{
        _key: 'rocscience-2025',
        name: 'Software Developer',
        company: 'Rocscience',
        desc: 'Built a Rasa chatbot that translates natural-language commands into executable UI actions in WPF applications.',
      }],
    },
    {
      _id: '2024',
      year: '2024',
      works: [
        {
          _key: 'rocscience-2024',
          name: 'Software Developer / QA',
          company: 'Rocscience',
          desc: 'Developed an OCR-based UI automation tool for WPF applications, using Tesseract OCR to dynamically locate and interact with UI objects.',
        },
        {
          _key: 'we-accelerate',
          name: 'Healthy Lifestyle Chatbot Developer',
          company: 'WE Accelerate — Microsoft Azure & Artificial Intelligence',
          desc: 'Planned a chatbot addressing health concerns with Azure ML and Cognitive Services to create personalized health recommendations.',
        },
      ],
    },
    {
      _id: '2023',
      year: '2023',
      works: [{
        _key: 'waterloo-rocketry',
        name: 'Software Subsystem Member',
        company: 'Waterloo Rocketry',
        desc: 'Developed Python code for Omnibus, a unified data bus that manages connections between data sources used during tests.',
      }],
    },
    {
      _id: '2022',
      year: '2022',
      works: [{
        _key: 'greek-stop',
        name: 'Food Service Worker',
        company: 'Greek Stop',
        desc: 'Worked in a fast-paced environment that required communication, multitasking, and efficiency to deliver timely, high-quality service.',
      }],
    },
  ],
};

export const portfolioQuery = `{
  "abouts": *[_type == "abouts"] | order(_createdAt asc) { _id, title, description },
  "works": *[_type == "works"] | order(_updatedAt desc) {
    _id, title, description, tags, projectLink, codeLink, imgUrl
  },
  "skills": *[_type == "skills"] | order(name asc) { _id, name },
  "experiences": *[_type == "experiences"] | order(year desc) { _id, year, works }
}`;
