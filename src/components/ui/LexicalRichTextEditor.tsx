// src/components/ui/LexicalRichTextEditor.tsx
'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState } from 'lexical';
import React from 'react';

type Props = {
  initialContent?: string;
  onChange: (value: string) => void;
};

const theme = {
  // styling for editor
  paragraph: 'my-1',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  heading: {
    h1: 'text-3xl font-bold my-2',
    h2: 'text-2xl font-semibold my-2',
    h3: 'text-xl font-semibold my-2',
  },
  list: {
    listitem: 'ml-6 list-disc',
  },
};

const onError = (error: Error) => {
  console.error(error);
};

export default function LexicalRichTextEditor({
  initialContent = '',
  onChange,
}: Props) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    editorState: initialContent ? JSON.parse(initialContent) : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className='min-h-[150px] rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none' />
        }
        placeholder={<div className='text-gray-400'>Write something...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState: EditorState) => {
          editorState.read(() => {
            const htmlString = JSON.stringify(editorState);
            onChange(htmlString);
          });
        }}
      />
    </LexicalComposer>
  );
}
