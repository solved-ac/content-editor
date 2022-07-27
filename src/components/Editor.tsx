import React from 'react'

import { $getRoot, $getSelection } from 'lexical'

import styled from '@emotion/styled'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { Divider, Space } from '@solved-ac/ui-react'
import ToolbarPlugin from './plugins/ToolbarPlugin'

const EditorContainer = styled.div`
  border: ${({ theme }) => theme.styles.border()};
  padding: 0 8px;
  border-radius: 8px;
`

const theme = {
  // Theme styling goes here
}

const initialConfig = {
  namespace: 'SolvedEditor',
  theme,
  onError: console.error,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
}

export const Editor: React.FC = () => {
  return (
    <EditorContainer>
      <Space h={8} />
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <Space h={8} />
        <Divider margin="none" />
        <Space h={8} />
        <TablePlugin />
        <ListPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ minHeight: 200 }} />}
          placeholder={<div />}
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
        <MarkdownShortcutPlugin />
      </LexicalComposer>
      <Space h={8} />
    </EditorContainer>
  )
}
