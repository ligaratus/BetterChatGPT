import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import RefreshIcon from '@icon/RefreshIcon';
import TickIcon from '@icon/TickIcon';
// import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import { CharacterProfile } from '@type/character';

const ProfileEditView = ({
    type,
    content,
    setIsEdit,
    canGenerate = false,
}: {
    type: CharacterProfile;
    content: string;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    canGenerate?: boolean;
}) => {
  // const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();

  useEffect(() => {
    _setContent(content);
  }, [content])

  // const resetTextAreaHeight = () => {
  //   if (textareaRef.current) textareaRef.current.style.height = 'auto';
  // };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     const isMobile =
//       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
//         navigator.userAgent
//       );

//     if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
//       const enterToSubmit = useStore.getState().enterToSubmit;

//       if (e.ctrlKey && e.shiftKey) {
//         e.preventDefault();
//         handleGenerate();
//         resetTextAreaHeight();
//       } else if (
//         (enterToSubmit && !e.shiftKey) ||
//         (!enterToSubmit && (e.ctrlKey || e.shiftKey))
//       ) {
//         handleSave();
//       }
//     }
//   };

  const handleSave = () => {
    if (_content === '' || useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const character = updatedChats[currentChatIndex].character;
    
    switch (type) {
        case 'description':
            character.description = _content;
            break;
        case 'attributes':
            character.attributes = _content;
            break;
        case 'personality':
            character.personality = _content;
            break;
        case 'dialogSamples':
            character.dialogSamples = _content;
            break;
        case 'backgroundLore':
            character.backgroundLore = _content;
            break;
        default:
            break;
    }
    
    setIsEdit(false);

    updatedChats[currentChatIndex].character = character;
    setChats(updatedChats);
  };

//   const { handleSubmit } = useSubmit();
  const handleGenerate = () => {
    if (useStore.getState().generating) return;
    // const updatedChats: ChatInterface[] = JSON.parse(
    //   JSON.stringify(useStore.getState().chats)
    // );
    // const character = updatedChats[currentChatIndex].character;
    
    // switch (type) {
    //     case 'description':
    //         character.description = _content;
    //     default:
    //         break;
    // }
    
    // setIsEdit(false);

    // updatedChats[currentChatIndex].character = character;
    // setChats(updatedChats);
    // handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <div className='w-full flex'>
        <div
          className={`w-full p-3 border border-grey-650 border rounded-md grey-650 text-sm dark:bg-gray-800 dark:text-gray-100`}
        >
          <textarea
            ref={textareaRef}
            className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40'
            onChange={(e) => {
              _setContent(e.target.value);
            }}
            value={_content}
            placeholder={t('Type here') as string}
          //   onKeyDown={handleKeyDown}
            rows={1}
          ></textarea>
        </div>
        
        {/* grow the flex so it matches the height of container */}
        <div className='ml-2 flex flex-col justify-between'>
          <button className='btn relative btn-primary w-8 h-8 p-2'
            onClick={handleSave}>
            <TickIcon />
          </button>

          {canGenerate &&
            <button className='btn relative btn-gray w-8 h-8 p-2'
              onClick={handleGenerate}
            >
              <RefreshIcon />
            </button>}
        </div>
      </div>
      {/* <EditViewButtons
        sticky={false}
        handleGenerate={handleGenerate}
        handleSave={handleSave}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        _setContent={_setContent}
      /> */}
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleGenerate}
        />
      )}
    </>
  );
};

const EditViewButtons = memo(
  ({
    sticky = false,
    handleGenerate,
    handleSave,
    setIsModalOpen,
    setIsEdit,
    _setContent,
  }: {
    sticky?: boolean;
    handleGenerate: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    _setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { t } = useTranslation();
    const generating = useStore.getState().generating;

    return (
      <div className='flex'>
        <div className='flex-1 text-center mt-2 flex justify-center'>
          {sticky && (
            <button
              className={`btn relative mr-2 btn-primary ${
                generating ? 'cursor-not-allowed opacity-40' : ''
              }`}
              onClick={handleGenerate}
              aria-label={t('generate') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          {sticky || (
            <button
              className='btn relative mr-2 btn-primary'
              onClick={() => {
                !generating && setIsModalOpen(true);
              }}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          <button
            className={`btn relative mr-2 ${
              sticky
                ? `btn-neutral ${
                    generating ? 'cursor-not-allowed opacity-40' : ''
                  }`
                : 'btn-neutral'
            }`}
            onClick={handleSave}
            aria-label={t('save') as string}
          >
            <div className='flex items-center justify-center gap-2'>
              {t('save')}
            </div>
          </button>

          {sticky || (
            <button
              className='btn relative btn-neutral'
              onClick={() => setIsEdit(false)}
              aria-label={t('cancel') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('cancel')}
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default ProfileEditView;
