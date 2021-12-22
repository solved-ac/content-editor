import * as React from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

interface Props {
  html: string
  onChange: (event: ContentEditableEvent) => void
}

export const ExampleComponent = ({ html, onChange }: Props) => {
  return <ContentEditable html={html} onChange={onChange} />
}
