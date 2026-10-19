export interface TeamMember {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  role: {
    ar: string;
    en: string;
  };
  photo?: string;
  links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// TODO: Team to provide real team members before launch
export const teamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: {
      ar: 'عضو الفريق ١',
      en: 'Team Member 1',
    },
    role: {
      ar: 'مؤسس ومطوّر برمجيات',
      en: 'Founder & Software Engineer',
    },
    // photo: '/team/member-1.jpg', // TODO: Add photo when available
    links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'member-2',
    name: {
      ar: 'عضو الفريق ٢',
      en: 'Team Member 2',
    },
    role: {
      ar: 'تصميم تجربة المستخدم والمنتج',
      en: 'Product & UX Designer',
    },
    links: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'member-3',
    name: {
      ar: 'عضو الفريق ٣',
      en: 'Team Member 3',
    },
    role: {
      ar: 'ذكاء اصطناعي ومعالجة لغة طبيعية',
      en: 'AI & NLP Specialist',
    },
    links: {
      github: 'https://github.com',
    },
  },
];
