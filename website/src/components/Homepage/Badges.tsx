import type {ReactNode} from 'react';

type BadgeItem = {
  href: string;
  alt: string;
  badge: string;
};

const BadgesList: BadgeItem[] = [
  {
    href: 'https://npmjs.com/package/@horayzen-developers/medoo-js',
    alt: 'Downloads',
    badge: 'npm/dm/@horayzen-developers',
  },
  {
    href: 'https://npmjs.com/package/@horayzen-developers/medoo-js',
    alt: 'Latest Version',
    badge: 'npm/v/@horayzen-developers',
  },
  {
    href: 'https://github.com/horayzen-devs-collab/medoo-js',
    alt: 'License',
    badge: 'github/license/horayzen-devs-collab',
  },
];

function Badge({href, alt, badge}: BadgeItem) {
  return (
    <a href={href} target="_blank">
      <img alt={alt} src={`https://img.shields.io/${badge}%2Fmedoo-js?style=for-the-badge`}/>
    </a>
  );
}

export default function HomepageBadges(): ReactNode {
  return (
    <div className="badges">
      {BadgesList.map((props, idx) => (
        <Badge key={idx} {...props} />
      ))}
    </div>
  );
}
