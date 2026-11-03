import type { ReactNode } from 'react';

export default function DocParams({ children }): ReactNode {
  return (
    <ul className="doc-params">
      {children}
    </ul>
  )
}

export function ParamsItem({ children, title }): ReactNode {
  return (
  	<li>
      <h5>{title}</h5>
        {children}
		</li>
  )
}