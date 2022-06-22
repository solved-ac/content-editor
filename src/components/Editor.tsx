import React from 'react'

import { $getRoot, $getSelection } from 'lexical'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'

const theme = {
  // Theme styling goes here
}

const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError: console.error,
}

export const Editor: React.FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
      />
      <OnChangePlugin
        onChange={(state) => {
          state.read(() => {
            // Read the contents of the EditorState here.
            const root = $getRoot()
            const selection = $getSelection()

            console.log(root, selection)
          })
        }}
      />
      <HistoryPlugin />
    </LexicalComposer>
  )
}
