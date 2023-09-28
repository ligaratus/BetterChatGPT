import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { ChatInterface } from '@type/chat';
import TickIcon from '@icon/TickIcon';
import EditIcon from '@icon/EditIcon';

const CharacterNameInput = ({
  value,
  disabled,
}: {
  value: string;
  disabled?: boolean;
}) => {
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const { t } = useTranslation();

  const [_content, _setContent] = useState<string>(value);
  const [isEdit, setIsEdit] = useState<boolean>(value.length == 0);
  
  const handleChange = (e: any) => {
    _setContent(e.target.value);
  }

  const handleSave = () => {
    if (_content === '' || useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const character = updatedChats[currentChatIndex].character;
    character.name = _content;
    _setContent(character.name);

    updatedChats[currentChatIndex].character = character;
    setChats(updatedChats)

    setIsEdit(false);
  }
  
  useEffect(() => {
    if (value.length == 0) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
    _setContent(value);
  }, [value])
  
  return (
    <div className='flex items-center'>
      {!isEdit && <h1>{_content}</h1>}
      {isEdit && <input
        disabled={disabled}
        type='text'
        className='w-64 text-gray-800 dark:text-white p-3 text-sm bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-opacity m-0 w-full h-full focus:outline-none rounded border border-white/20'
        placeholder={"Type character name..."}
        value={_content}
        onChange={(e) => {
          handleChange(e);
        }}
      />}

      {!isEdit && <button className='btn relative btn-secondary w-8 h-8 p-2 ml-4'
        onClick={() => setIsEdit(true)}>
        <EditIcon />
      </button>}
      {isEdit && <button className='btn relative btn-primary w-8 h-8 p-2 ml-2'
        onClick={handleSave}>
        <TickIcon />
      </button>}
    </div>
  );
};

export default CharacterNameInput;
