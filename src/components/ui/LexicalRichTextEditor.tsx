// src/components/ui/LexicalRichTextEditor.tsx
// src/components/ui/LexicalRichTextEditor.tsx
'use client';

import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  ElementFormatType,
} from 'lexical';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  initialContent?: string;
  onChange: (value: string) => void;
};

const theme = {
  paragraph: 'my-1 text-gray-900',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  heading: {
    h1: 'text-3xl font-bold my-3 text-gray-900',
    h2: 'text-2xl font-semibold my-2 text-gray-900',
    h3: 'text-xl font-semibold my-2 text-gray-900',
    h4: 'text-lg font-semibold my-1 text-gray-900',
    h5: 'text-base font-semibold my-1 text-gray-900',
    h6: 'text-sm font-semibold my-1 text-gray-900',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-4',
    ul: 'list-disc ml-4',
    listitem: 'my-1',
  },
  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-700 my-2',
  code: 'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm',
  codeblock: 'bg-gray-100 rounded p-3 font-mono text-sm my-2',
  link: 'text-blue-600 hover:text-blue-800 underline',
};

const onError = (error: Error) => {
  console.error('Lexical Editor Error:', error);
};

// Toolbar Component
function ToolbarComponent() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const type = element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? (element.getTag() as string)
            : (element.getType() as string);
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  const formatText = (
    format: 'bold' | 'italic' | 'underline' | 'strikethrough'
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: string) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            const parent = node.getParent();
            if (parent && !$isListNode(parent)) {
              const heading = $createHeadingNode(headingSize as any);
              parent.replace(heading);
              heading.append(...parent.getChildren());
            }
          });
        }
      });
    }
  };

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            const parent = node.getParent();
            if (parent && !$isListNode(parent)) {
              const paragraph = $createParagraphNode();
              parent.replace(paragraph);
              paragraph.append(...parent.getChildren());
            }
          });
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            const parent = node.getParent();
            if (parent && !$isListNode(parent)) {
              const quote = $createQuoteNode();
              parent.replace(quote);
              quote.append(...parent.getChildren());
            }
          });
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatAlignment = (alignment: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div className='flex flex-wrap items-center gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 p-2'>
      {/* Block Type Selector */}
      <select
        value={blockType}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') formatParagraph();
          else if (value === 'quote') formatQuote();
          else if (value.startsWith('h')) formatHeading(value);
        }}
        className='rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
      >
        <option value='paragraph'>Paragraph</option>
        <option value='h1'>Heading 1</option>
        <option value='h2'>Heading 2</option>
        <option value='h3'>Heading 3</option>
        <option value='h4'>Heading 4</option>
        <option value='h5'>Heading 5</option>
        <option value='h6'>Heading 6</option>
        <option value='quote'>Quote</option>
      </select>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      {/* Text Formatting */}
      <button
        type='button'
        onClick={() => formatText('bold')}
        className={`rounded p-2 hover:bg-gray-200 ${isBold ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Bold'
      >
        <Bold size={16} />
      </button>

      <button
        type='button'
        onClick={() => formatText('italic')}
        className={`rounded p-2 hover:bg-gray-200 ${isItalic ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Italic'
      >
        <Italic size={16} />
      </button>

      <button
        type='button'
        onClick={() => formatText('underline')}
        className={`rounded p-2 hover:bg-gray-200 ${isUnderline ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Underline'
      >
        <Underline size={16} />
      </button>

      <button
        type='button'
        onClick={() => formatText('strikethrough')}
        className={`rounded p-2 hover:bg-gray-200 ${isStrikethrough ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Strikethrough'
      >
        <Strikethrough size={16} />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      {/* Lists */}
      <button
        type='button'
        onClick={formatBulletList}
        className={`rounded p-2 hover:bg-gray-200 ${blockType === 'bullet' ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Bullet List'
      >
        <List size={16} />
      </button>

      <button
        type='button'
        onClick={formatNumberedList}
        className={`rounded p-2 hover:bg-gray-200 ${blockType === 'number' ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Numbered List'
      >
        <ListOrdered size={16} />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      {/* Alignment */}
      <button
        type='button'
        onClick={() => formatAlignment('left')}
        className='rounded p-2 hover:bg-gray-200'
        title='Align Left'
      >
        <AlignLeft size={16} />
      </button>

      <button
        type='button'
        onClick={() => formatAlignment('center')}
        className='rounded p-2 hover:bg-gray-200'
        title='Align Center'
      >
        <AlignCenter size={16} />
      </button>

      <button
        type='button'
        onClick={() => formatAlignment('right')}
        className='rounded p-2 hover:bg-gray-200'
        title='Align Right'
      >
        <AlignRight size={16} />
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300' />

      {/* Quote */}
      <button
        type='button'
        onClick={formatQuote}
        className={`rounded p-2 hover:bg-gray-200 ${blockType === 'quote' ? 'bg-blue-100 text-blue-600' : ''}`}
        title='Quote'
      >
        <Quote size={16} />
      </button>
    </div>
  );
}

export default function LexicalRichTextEditor({
  initialContent = '',
  onChange,
}: Props) {
  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: (() => {
      if (initialContent) {
        try {
          return JSON.parse(initialContent);
        } catch (error) {
          console.warn('Failed to parse initial content:', error);
          return undefined;
        }
      }
      return undefined;
    })(),
  };

  return (
    <div className='overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500'>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarComponent />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className='min-h-[200px] resize-none p-4 text-gray-900 focus:outline-none' />
          }
          placeholder={
            <div className='pointer-events-none absolute top-4 left-4 text-gray-400'>
              Enter your content...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              try {
                const htmlString = JSON.stringify(editorState);
                onChange(htmlString);
              } catch (error) {
                console.error('Failed to serialize editor state:', error);
              }
            });
          }}
        />
      </LexicalComposer>
    </div>
  );
}
