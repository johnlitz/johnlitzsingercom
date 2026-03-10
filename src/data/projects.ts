export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  links: { label: string; url: string }[];
  thumbnail?: string;
}

export const projects: Project[] = [
  {
    slug: 'personal-website',
    title: 'Personal Website',
    description:
      'Portfolio and blog built with Astro, MDX, and React. Minimal single-column design with Rethink Sans typography.',
    tech: ['Astro', 'React', 'MDX'],
    links: [
      { label: 'Live', url: 'https://johnlitzsinger.com' },
      { label: 'GitHub', url: 'https://github.com/johnlitz/johnlitzsingercom' },
    ],
  },
  {
    slug: 'pharmacy-benefit-analyzer',
    title: 'Pharmacy Benefit Analyzer',
    description:
      'Internal tool for modeling drug trend data and surfacing cost-saving opportunities in employer health plans.',
    tech: ['Python', 'Pandas'],
    links: [],
  },
  {
    slug: 'launch-consulting-site',
    title: 'Launch Consulting Site',
    description:
      'Marketing site for Purdue Launch Consulting Club. Designed and built as co-founder.',
    tech: ['HTML', 'CSS', 'JS'],
    links: [{ label: 'GitHub', url: 'https://github.com/johnlitz' }],
  },
];
