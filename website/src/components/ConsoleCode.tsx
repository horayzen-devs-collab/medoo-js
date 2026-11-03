import type { ReactNode } from 'react';

export default function ConsoleCode({ text }): ReactNode {
  return (
  	<code className="console-code">
  		{text}
		</code>
  )
}