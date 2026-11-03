import type { ReactNode } from 'react';

export default function DocNote({ children }): ReactNode {
  return (
  	<div className="doc-note">
      {children}
		</div>
  )
}