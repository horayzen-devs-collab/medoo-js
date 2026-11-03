import type { ReactNode } from 'react';

export default function DocList({ children }): ReactNode {
  return (
  	<ul className="doc-list">
  		{children}
		</ul>
  )
}

export function ListItem({ children, title, link }): ReactNode {
  return (
    <li>
      <a href={link}>
        <h5>{title}</h5>
        <p>{children}</p>
      </a>
    </li>
  )
}