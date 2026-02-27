export const navItems = [
  { href: '/work', label: 'Work', match: 'exact' as const },
  { href: '/projects', label: 'Projects', match: 'exact' as const },
  { href: '/blog', label: 'Writing', match: 'prefix' as const },
  { href: '/contact', label: 'Contact', match: 'prefix' as const },
] as const;
