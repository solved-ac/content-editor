import { ThemeProvider } from '@emotion/react'
import { Editor } from '@solved-ac/content-editor'
import { SolvedGlobalStyles, solvedThemes, Typo } from '@solved-ac/ui-react'
import React from 'react'

const App = () => {
  return (
    <ThemeProvider theme={solvedThemes.light}>
      <SolvedGlobalStyles />
      <div
        style={{
          padding: 16,
        }}
      >
        <Typo variant="h1">@solved-ac/content-editor</Typo>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(0, 1fr)',
            width: '100%',
            gap: 16,
            minHeight: 72,
          }}
        >
          <div>
            <Editor />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
