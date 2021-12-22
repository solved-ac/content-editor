import { ExampleComponent } from '@solved-ac/content-editor'
import '@solved-ac/content-editor/dist/index.css'
import React, { useState } from 'react'
import './index.css'

const App = () => {
  const [state, setState] = useState<string>('Sample text')

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(0, 1fr)',
        width: '100%',
        padding: 16,
        gap: 16,
        minHeight: 72
      }}
    >
      <div>
        <ExampleComponent
          html={state}
          onChange={(event) => setState(event.target.value)}
        />
      </div>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          <code>{state}</code>
        </pre>
      </div>
    </div>
  )
}

export default App
