import React, {
    DetailedHTMLProps,
    HTMLAttributes,
    memo,
    useState,
  } from 'react';
  
  import ReactMarkdown from 'react-markdown';
  import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
  
  import rehypeKatex from 'rehype-katex';
  import rehypeHighlight from 'rehype-highlight';
  import remarkMath from 'remark-math';
  import remarkGfm from 'remark-gfm';
  import useStore from '@store/store';
  
  import TickIcon from '@icon/TickIcon';
  import EditIcon from '@icon/EditIcon';
  
  import useSubmit from '@hooks/useSubmit';
  
  import { ChatInterface } from '@type/chat';
  
  import { codeLanguageSubset } from '@constants/chat';
import CodeBlock from '../../Message/CodeBlock';
    
  const ProfileContentView = memo(
    ({
        content,
        setIsEdit,
    }: {
      content: string;
      setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
      const { handleSubmit } = useSubmit();
    
      const currentChatIndex = useStore((state) => state.currentChatIndex);
      const setChats = useStore((state) => state.setChats);
      const lastMessageIndex = useStore((state) =>
        state.chats ? state.chats[state.currentChatIndex].messages.length - 1 : 0
      );
      const inlineLatex = useStore((state) => state.inlineLatex);
      const markdownMode = useStore((state) => state.markdownMode);
  
      const handleCopy = () => {
        navigator.clipboard.writeText(content);
      };
  
      return (
        <>
            <div className='w-full flex'>
                <div className='markdown prose w-full md:max-w-full break-words dark:prose-invert dark share-gpt-message'>
                    {markdownMode ? (
                    <ReactMarkdown
                        remarkPlugins={[
                        remarkGfm,
                        [remarkMath, { singleDollarTextMath: inlineLatex }],
                        ]}
                        rehypePlugins={[
                        rehypeKatex,
                        [
                            rehypeHighlight,
                            {
                            detect: true,
                            ignoreMissing: true,
                            subset: codeLanguageSubset,
                            },
                        ],
                        ]}
                        linkTarget='_new'
                        components={{
                        code,
                        p,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                    ) : (
                    <span className='whitespace-pre-wrap'>{content}</span>
                    )}
                </div>
                <div className='ml-2 flex flex-col justify-between'>
                    <button className='btn relative btn-secondary w-8 h-8 p-2'
                        onClick={() => setIsEdit(true)}>
                        <EditIcon />
                    </button>
                </div>
            </div>
        </>
      );
    }
  );
  
  const code = memo((props: CodeProps) => {
    const { inline, className, children } = props;
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1];
  
    if (inline) {
      return <code className={className}>{children}</code>;
    } else {
      return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
    }
  });
  
  const p = memo(
    (
      props?: Omit<
        DetailedHTMLProps<
          HTMLAttributes<HTMLParagraphElement>,
          HTMLParagraphElement
        >,
        'ref'
      > &
        ReactMarkdownProps
    ) => {
      return <p className='whitespace-pre-wrap'>{props?.children}</p>;
    }
  );
  
  export default ProfileContentView;
  