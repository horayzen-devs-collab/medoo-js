import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Logo({ text, props = {} }): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return <img
    {...props}
    src={siteConfig.themeConfig.navbar.logo.src}
    alt={text}
  />
}