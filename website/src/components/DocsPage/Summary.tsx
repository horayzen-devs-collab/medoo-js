import type { ReactNode } from 'react';

export default function DocSummary({ summary }): ReactNode {
  return (
  	<p className="doc-summary">
  		{summary}
		</p>
  )
}