export const navItems = [
  { href: '/work', label: 'Work', match: 'exact' as const, index: '01' },
  { href: '/projects', label: 'Projects', match: 'exact' as const, index: '02' },
  { href: '/blog', label: 'Writing', match: 'prefix' as const, index: '03' },
  { href: '/contact', label: 'Contact', match: 'prefix' as const, index: '04' },
] as const;
