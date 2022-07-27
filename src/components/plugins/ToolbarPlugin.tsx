/* eslint-disable no-param-reassign */
import styled from '@emotion/styled'
import { $createCodeNode, $isCodeNode } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType
} from '@lexical/rich-text'
import {
    $getSelectionStyleValueForProperty,
    $isAtNodeEnd,
    $isParentElementRTL,
    $patchStyleText,
    $selectAll,
    $wrapLeafNodesInElements
} from '@lexical/selection'
import {
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    mergeRegister
} from '@lexical/utils'
import { Button } from '@solved-ac/ui-react'
import type { LexicalEditor, RangeSelection } from 'lexical'
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    ElementNode,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextNode,
    UNDO_COMMAND
} from 'lexical'
import * as React from 'react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
    TbAlignCenter,
    TbAlignJustified,
    TbAlignLeft,
    TbAlignRight,
    TbArrowLeft,
    TbArrowRight,
    TbBlockquote,
    TbBold,
    TbBrackets,
    TbClearFormatting,
    TbCode,
    TbH1,
    TbH2,
    TbH3,
    TbIndentDecrease,
    TbIndentIncrease,
    TbItalic,
    TbLetterT,
    TbLink,
    TbList,
    TbListCheck,
    TbListNumbers,
    TbMinus,
    TbStrikethrough,
    TbSubscript,
    TbSuperscript,
    TbUnderline
} from 'react-icons/tb'

const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const ToolsetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const VerticalDivider = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.border};
  width: 1px;
`

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const { anchor, focus } = selection
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  }
  return $isAtNodeEnd(anchor) ? focusNode : anchorNode
}

function BlockFormatDropDown({
  editor,
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName
  editor: LexicalEditor
}): JSX.Element {
  const formatParagraph = (): void => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode())
        }
      })
    }
  }

  const formatHeading = (headingSize: HeadingTagType): void => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () =>
            $createHeadingNode(headingSize)
          )
        }
      })
    }
  }

  const formatBulletList = (): void => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatCheckList = (): void => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = (): void => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatQuote = (): void => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatCode = (): void => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapLeafNodesInElements(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            selection.insertRawText(textContent)
          }
        }
      })
    }
  }

  return (
    <ToolsetContainer>
      <Button onClick={formatParagraph}>
        <TbLetterT />
      </Button>
      <Button onClick={() => formatHeading('h1')}>
        <TbH1 />
      </Button>
      <Button onClick={() => formatHeading('h2')}>
        <TbH2 />
      </Button>
      <Button onClick={() => formatHeading('h3')}>
        <TbH3 />
      </Button>
      <Button onClick={formatBulletList}>
        <TbList />
      </Button>
      <Button onClick={formatNumberedList}>
        <TbListNumbers />
      </Button>
      <Button onClick={formatCheckList}>
        <TbListCheck />
      </Button>
      <Button onClick={formatQuote}>
        <TbBlockquote />
      </Button>
      <Button onClick={formatCode}>
        <TbBrackets />
      </Button>
    </ToolsetContainer>
  )
}

function Select({
  onChange,
  className,
  options,
  value,
}: {
  className: string
  onChange: (e: ChangeEvent) => void
  options: [string, string][]
  value: string
}): JSX.Element {
  return (
    <select className={className} onChange={onChange} value={value}>
      {options.map(([option, text]) => (
        <option key={option} value={option}>
          {text}
        </option>
      ))}
    </select>
  )
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph')
  //   const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
  //     null
  //   )
  const [fontSize, setFontSize] = useState<string>('15px')
  //   const [fontColor, setFontColor] = useState<string>('#000')
  //   const [bgColor, setBgColor] = useState<string>('#fff')
  const [fontFamily, setFontFamily] = useState<string>('Arial')
  const [isLink, setIsLink] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isRTL, setIsRTL] = useState(false)
  //   const [codeLanguage, setCodeLanguage] = useState<string>('')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      // Update text format
      setIsRTL($isParentElementRTL(selection))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      if (elementDOM !== null) {
        // setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          }
          if ($isCodeNode(element)) {
            // const language =
            //   element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP
            // setCodeLanguage(
            //   language ? CODE_LANGUAGE_MAP[language] || language : ''
            // )
            return
          }
        }
      }
      // Handle Buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      )
      //   setFontColor(
      //     $getSelectionStyleValueForProperty(selection, 'color', '#000')
      //   )
      //   setBgColor(
      //     $getSelectionStyleValueForProperty(
      //       selection,
      //       'background-color',
      //       '#fff'
      //     )
      //   )
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      )
    }
  }, [activeEditor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar()
        setActiveEditor(newEditor)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [activeEditor, updateToolbar])

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [activeEditor]
  )

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $selectAll(selection)
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0)
            node.setStyle('')
            $getNearestBlockElementAncestorOrThrow(node).setFormat('')
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [activeEditor])

  const onFontSizeSelect = useCallback(
    (e: ChangeEvent) => {
      applyStyleText({ 'font-size': (e.target as HTMLSelectElement).value })
    },
    [applyStyleText]
  )

  //   const onFontColorSelect = useCallback(
  //     (value: string) => {
  //       applyStyleText({ color: value })
  //     },
  //     [applyStyleText]
  //   )

  //   const onBgColorSelect = useCallback(
  //     (value: string) => {
  //       applyStyleText({ 'background-color': value })
  //     },
  //     [applyStyleText]
  //   )

  const onFontFamilySelect = useCallback(
    (e: ChangeEvent) => {
      applyStyleText({ 'font-family': (e.target as HTMLSelectElement).value })
    },
    [applyStyleText]
  )

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  //   const onCodeLanguageSelect = useCallback(
  //     (e: ChangeEvent) => {
  //       activeEditor.update(() => {
  //         if (selectedElementKey !== null) {
  //           const node = $getNodeByKey(selectedElementKey)
  //           if ($isCodeNode(node)) {
  //             node.setLanguage((e.target as HTMLSelectElement).value)
  //           }
  //         }
  //       })
  //     },
  //     [activeEditor, selectedElementKey]
  //   )

  return (
    <ToolbarContainer>
      <ToolsetContainer>
        <Button
          disabled={!canUndo}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          title="Undo (Ctrl+Z)"
          className="toolbar-item spaced"
          aria-label="Undo"
        >
          <TbArrowLeft />
        </Button>
        <Button
          disabled={!canRedo}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          title="Redo (Ctrl+Y)"
          className="toolbar-item"
          aria-label="Redo"
        >
          <TbArrowRight />
        </Button>
      </ToolsetContainer>
      <VerticalDivider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <React.Fragment>
          <BlockFormatDropDown blockType={blockType} editor={editor} />
          <VerticalDivider />
        </React.Fragment>
      )}
      {blockType === 'code' ? (
        <React.Fragment />
      ) : (
        <React.Fragment>
          <ToolsetContainer>
            <React.Fragment>
              <Select
                className="toolbar-item font-family"
                onChange={onFontFamilySelect}
                options={[
                  ['Arial', 'Arial'],
                  ['Courier New', 'Courier New'],
                  ['Georgia', 'Georgia'],
                  ['Times New Roman', 'Times New Roman'],
                  ['Trebuchet MS', 'Trebuchet MS'],
                  ['Verdana', 'Verdana'],
                ]}
                value={fontFamily}
              />
              <i className="chevron-down inside" />
            </React.Fragment>
            <React.Fragment>
              <Select
                className="toolbar-item font-size"
                onChange={onFontSizeSelect}
                options={[
                  ['10px', '10px'],
                  ['11px', '11px'],
                  ['12px', '12px'],
                  ['13px', '13px'],
                  ['14px', '14px'],
                  ['15px', '15px'],
                  ['16px', '16px'],
                  ['17px', '17px'],
                  ['18px', '18px'],
                  ['19px', '19px'],
                  ['20px', '20px'],
                ]}
                value={fontSize}
              />
              <i className="chevron-down inside" />
            </React.Fragment>
          </ToolsetContainer>
          <VerticalDivider />
          <ToolsetContainer>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
              }}
              title="Bold (Ctrl+B)"
              aria-label="Format text as bold. Shortcut: Ctrl+B"
            >
              <TbBold />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
              }}
              title="Italic (Ctrl+I)"
              aria-label="Format text as italics. Shortcut: Ctrl+I"
            >
              <TbItalic />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
              }}
              title="Underline (Ctrl+U)"
              aria-label={`Format text to underlined. Shortcut: ${'Ctrl+U'}`}
            >
              <TbUnderline />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
              }}
              title="Insert code block"
              aria-label="Insert code block"
            >
              <TbCode />
            </Button>
            <Button
              onClick={insertLink}
              aria-label="Insert link"
              title="Insert link"
            >
              <TbLink />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough'
                )
              }}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              <TbStrikethrough />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
              }}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              <TbSubscript />
            </Button>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
              }}
              title="Superscript"
              aria-label="Format text with a superscript"
            >
              <TbSuperscript />
            </Button>
            <Button
              onClick={clearFormatting}
              className="item"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              <TbClearFormatting />
            </Button>
          </ToolsetContainer>
          <VerticalDivider />
          <ToolsetContainer>
            <Button
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                )
              }}
            >
              <TbMinus />
            </Button>
          </ToolsetContainer>
        </React.Fragment>
      )}
      <VerticalDivider />

      <ToolsetContainer>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
          }}
        >
          <TbAlignLeft />
        </Button>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }}
        >
          <TbAlignCenter />
        </Button>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }}
        >
          <TbAlignRight />
        </Button>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }}
        >
          <TbAlignJustified />
        </Button>
      </ToolsetContainer>
      <VerticalDivider />
      <ToolsetContainer>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }}
        >
          {isRTL ? <TbIndentIncrease /> : <TbIndentDecrease />}
        </Button>
        <Button
          onClick={() => {
            activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }}
        >
          {isRTL ? <TbIndentDecrease /> : <TbIndentIncrease />}
        </Button>
      </ToolsetContainer>
    </ToolbarContainer>
  )
}
