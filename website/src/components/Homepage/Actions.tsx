import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ActionsList: string[] = ['star', 'fork'];

function Action<Params extends { type: string }>({ type }: Params) {
  const {siteConfig} = useDocusaurusContext();
  return (
    <iframe
      src={`https://ghbtns.com/github-btn.html?user=${siteConfig.organizationName}&amp;repo=${siteConfig.projectName}&amp;type=${type}&amp;count=true&amp;size=large`}
      frameBorder="0"
      scrolling="0"
      width="75"
      height="30"
      title="GitHub"
    ></iframe>
  );
}

export default function HomepageActions(): ReactNode {
  return (
    <div className="action-btns">
      {ActionsList.map((action, idx) => (
        <Action key={idx} type={action} />
      ))}
    </div>
  );
}
