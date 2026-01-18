import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;