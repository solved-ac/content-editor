import { ThemeProvider } from '@emotion/react'
import { Editor } from '@solved-ac/content-editor'
import {
  Container,
  SolvedGlobalStyles,
  solvedThemes, Typo
} from '@solved-ac/ui-react'
import React from 'react'

const App = () => {
  return (
    <ThemeProvider theme={solvedThemes.light}>
      <SolvedGlobalStyles />
      <Container>
        <Typo variant="h1">@solved-ac/content-editor</Typo>
      </Container>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(0, 1fr)',
          width: '100%',
          padding: 16,
          gap: 16,
          minHeight: 72,
        }}
      >
        <div>
          <Editor />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
