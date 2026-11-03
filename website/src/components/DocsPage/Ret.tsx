import type { ReactNode } from 'react';

export default function DocRet({ children }): ReactNode {
  return (
  	<div className="doc-ret">
      {children}
		</div>
  )
}