import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            className={className}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                p: ({ children }) => <span className="mb-2 block last:mb-0">{children}</span>,
                // Override other elements if needed for Tailwind styling
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
