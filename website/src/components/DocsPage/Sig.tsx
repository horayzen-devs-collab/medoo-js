import type { ReactNode } from 'react';

export default function DocSig({ content }): ReactNode {
  return (
  	<div className="doc-sig">
  		{content}
		</div>
  )
}