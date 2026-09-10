export default {
    name: 'works',
    title: 'Works',
    type: 'document',
    fields: [
      {
        name: 'presentation', title: 'Gallery presentation', type: 'string',
        initialValue: 'standard',
        description: 'Lead spans the gallery; featured uses half width; standard uses a compact tile. On mobile all projects use one column.',
        options: { layout: 'radio', list: [
          { title: 'Lead feature', value: 'lead' },
          { title: 'Featured', value: 'featured' },
          { title: 'Standard', value: 'standard' },
        ] },
        validation: (Rule) => Rule.valid(['lead', 'featured', 'standard']),
      },
      {
        name: 'displayOrder', title: 'Gallery order', type: 'number',
        description: 'Lower numbers appear first within their presentation group. Unranked projects come last. Use 10, 20, 30 to leave room.',
        validation: (Rule) => Rule.integer().min(0),
      },
      {
        name: 'galleryFit', title: 'Gallery media treatment', type: 'string',
        initialValue: 'cover',
        description: 'Applies to the existing ImageUrl, an optional image override, and videos. Fill frame is the default; choose Show entire media to preserve all edges.',
        options: { layout: 'radio', list: [
          { title: 'Fill frame', value: 'cover' },
          { title: 'Show entire media', value: 'contain' },
        ] },
      },
      {
        name: 'galleryVideo', title: 'Gallery video (optional)', type: 'file',
        description: 'Upload an MP4 or WebM demo. It replaces the still preview with a player; the project image becomes its poster. Playback starts only when the visitor presses play.',
        options: { accept: 'video/mp4,video/webm' },
        fields: [
          { name: 'description', title: 'Video description', type: 'string', description: 'Briefly describe what the demo shows.', validation: (Rule) => Rule.required() },
          { name: 'captions', title: 'English captions (optional WebVTT)', type: 'file', options: { accept: '.vtt,text/vtt' }, description: 'Include captions when the video contains speech or meaningful audio.' },
          { name: 'transcript', title: 'Transcript or visual description (optional)', type: 'text', rows: 4 },
        ],
      },
      {
        name: 'galleryImage', title: 'Gallery image (optional)', type: 'image',
        description: 'Overrides ImageUrl in the projects gallery. Leave empty to keep the existing image.',
        options: { hotspot: true },
        fields: [
          { name: 'alt', title: 'Image description', type: 'string', validation: (Rule) => Rule.required() },
          // Retain existing draft values without exposing a second treatment control.
          { name: 'fit', title: 'Legacy image treatment', type: 'string', hidden: true },
        ],
      },
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
    
      {
        name: 'description',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'projectLink',
        title: 'Project Link',
        type: 'string',
      },
      {
        name: 'codeLink',
        title: 'Code Link',
        type: 'string',
      },
      {
        name: 'imgUrl',
        title: 'ImageUrl',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
   
      {
        name: 'tags',
        title: 'Tags',
       type:'array',
       of: [
         {
           name:'tag',
           title:'Tag',
           type:'string'
         }
       ]
      },
     
    ],
  };
