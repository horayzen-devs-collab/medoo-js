import type { ReactNode } from 'react';

export default function DocIntro({ children }): ReactNode {
  return (
  	<div className="doc-intro">
  		<div>
        {children}
      </div>
		</div>
  )
}