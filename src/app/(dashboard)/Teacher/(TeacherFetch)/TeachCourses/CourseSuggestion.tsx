export type Department = 'science' | 'arts' | null;

export interface CourseSuggestion {
  subject: string;
  courseId: string;
  department: Department;
}

export const courseSuggestions: CourseSuggestion[] = [
  // Science
  { subject: 'Mathematics', courseId: 'MATH', department: 'science' },
  { subject: 'Biology', courseId: 'BIO', department: 'science' },
  { subject: 'Chemistry', courseId: 'CHEM', department: 'science' },
  { subject: 'Physics', courseId: 'PHYS', department: 'science' },
  { subject: 'Agricultural Science', courseId: 'AGRIC', department: 'science' },
  { subject: 'Basic Science', courseId: 'BSC', department: 'science' },
  { subject: 'Health Education', courseId: 'HEDU', department: 'science' },
  { subject: 'Physical Education', courseId: 'PE', department: 'science' },
  { subject: 'Technical Drawing', courseId: 'TD', department: 'science' },
  { subject: 'Computer Science', courseId: 'CS', department: 'science' },
  { subject: 'Further Mathematics', courseId: 'FMATH', department: 'science' },
  { subject: 'Integrated Science', courseId: 'IS', department: 'science' },
  { subject: 'Basic Technology', courseId: 'BTECH', department: 'science' },
  { subject: 'Introductory Technology', courseId: 'TECH', department: 'science' },
  { subject: 'Introduction to Science', courseId: 'INTSCI', department: 'science' },
  { subject: 'Science Laboratory', courseId: 'LAB', department: 'science' },

  // Arts
  { subject: 'English Language', courseId: 'ENG', department: 'arts' },
  { subject: 'Literature in English', courseId: 'LIT', department: 'arts' },
  { subject: 'Civic Education', courseId: 'CIVIC', department: 'arts' },
  { subject: 'Christian Religious Studies', courseId: 'CRS', department: 'arts' },
  { subject: 'Islamic Religious Studies', courseId: 'IRS', department: 'arts' },
  { subject: 'History', courseId: 'HIST', department: 'arts' },
  { subject: 'Government', courseId: 'GOVT', department: 'arts' },
  { subject: 'Social Studies', courseId: 'SOC', department: 'arts' },
  { subject: 'Geography', courseId: 'GEO', department: 'arts' },
  { subject: 'Music', courseId: 'MUSIC', department: 'arts' },
  { subject: 'Fine Arts', courseId: 'ARTS', department: 'arts' },
  { subject: 'Home Economics', courseId: 'HOME', department: 'arts' },
  { subject: 'Cultural and Creative Arts', courseId: 'CCA', department: 'arts' },
  { subject: 'Drama', courseId: 'DRAMA', department: 'arts' },
  { subject: 'Creative Writing', courseId: 'CW', department: 'arts' },
  { subject: 'Speech and Drama', courseId: 'SPEECH', department: 'arts' },
  { subject: 'Current Affairs', courseId: 'CA', department: 'arts' },
  { subject: 'Typing and Office Practice', courseId: 'TOP', department: 'arts' },
  { subject: 'Reading Comprehension', courseId: 'READ', department: 'arts' },

  // Languages (under arts)
  { subject: 'French', courseId: 'FR', department: 'arts' },
  { subject: 'Yoruba', courseId: 'YOR', department: 'arts' },
  { subject: 'Igbo', courseId: 'IGB', department: 'arts' },
  { subject: 'Hausa', courseId: 'HAU', department: 'arts' },
  { subject: 'Arabic', courseId: 'ARABIC', department: 'arts' },

  // Nursery / Primary (department = null)
  { subject: 'Nursery Rhymes', courseId: 'NRHY', department: null },
  { subject: 'Phonics', courseId: 'PHON', department: null },
  { subject: 'Pre-Writing Skills', courseId: 'PWS', department: null },
  { subject: 'Coloring', courseId: 'CLR', department: null },
  { subject: 'Story Time', courseId: 'STORY', department: null },
  { subject: 'Handwriting', courseId: 'HAND', department: null },
  { subject: 'Drawing', courseId: 'DRAW', department: null },
  { subject: 'Number Work', courseId: 'NUM', department: null },
  { subject: 'Letter Work', courseId: 'LET', department: null },
  { subject: 'Moral Instruction', courseId: 'MORAL', department: null },
  { subject: 'Puzzles & Games', courseId: 'PUZZLE', department: null },
  { subject: 'Songs & Rhymes', courseId: 'SONG', department: null },
  { subject: 'Environmental Studies', courseId: 'ENV', department: null },
  { subject: 'Life Skills', courseId: 'LIFE', department: null },
  { subject: 'Sight Words', courseId: 'SIGHT', department: null },
  { subject: 'Listening Skills', courseId: 'LISTEN', department: null },
  { subject: 'Basic Arithmetic', courseId: 'BARTH', department: null },
  { subject: 'Verbal Reasoning', courseId: 'VERB', department: null },
  { subject: 'Quantitative Reasoning', courseId: 'QUANT', department: null },
  { subject: 'Flash Cards', courseId: 'FLASH', department: null },

  // Extra nursery/primary to hit 70
  { subject: 'Tracing', courseId: 'TRACE', department: null },
  { subject: 'Counting', courseId: 'COUNT', department: null },
  { subject: 'Practical Life', courseId: 'PRACTICAL', department: null },
  { subject: 'Shapes & Patterns', courseId: 'SHAPES', department: null },
  { subject: 'Sand Play', courseId: 'SAND', department: null },
];
