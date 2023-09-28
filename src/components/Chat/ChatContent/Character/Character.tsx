import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface, Role } from '@type/chat';
import Avatar from './Avatar';
import { CharacterInterface } from '@type/character';
import useCharacterGeneration from '@hooks/useCharacterGeneration';
import Profile from './Profile';
import CharacterNameInput from './CharacterNameInput';
import CrossIcon from '@icon/CrossIcon';

const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const Character = React.memo(
  ({
    role,
    character,
  }: {
    role: Role;
    character: CharacterInterface;
  }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const [error, setError] = useState<string>('')

    const { t } = useTranslation();
    const { generateCharacterProfiles } = useCharacterGeneration();
    const generating = useStore.getState().generating;
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);

    const handleGenerate = async (useBestModel: boolean) => {
        if (generating) return;
        if (character.name.length == 0 || character.description.length == 0) {
            setError('Please fill in the name and description first.');
            return;
        }
        
        await generateCharacterProfiles(false);
        setTitle();
    }

    const setTitle = () => {
        const updatedChats: ChatInterface[] = JSON.parse(
            JSON.stringify(useStore.getState().chats)
        );
        updatedChats[currentChatIndex].title = character.name;
        setChats(updatedChats);
    }

    useEffect(() => {
        if (generating) {
          setError('');
        }
    }, [generating]);

    // useEffect(() => {
    //     reset()
    // }, [currentChatIndex])

    // const reset = () => {
    //     console.log(character)
    // }
    
    return (
      <div
        className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
          backgroundStyle[0]
        }`}
      >
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <Avatar role={role} />
          <div className='w-[calc(100%-50px)] '>
            <h1 className='text-xl font-medium mb-2'>Name</h1>
            <CharacterNameInput 
                value={character.name} />
            
            <div className='w-full h-1 my-8 bg-gray-200 dark:bg-gray-500 rounded-full'></div>
                
            <h1 className='text-xl font-medium mt-3 mb-2'>Description</h1>
            <Profile 
                type={'description'}
                content={character.description}
                // isEdit={character.description.length == 0}
            />

            {character.isInitialised && <>
                <div className='w-full h-1 my-8 bg-gray-200 dark:bg-gray-500 rounded-full'></div>
                
                <h1 className='text-xl font-medium mb-2'>Attributes</h1>
                <Profile 
                    type={'attributes'}
                    content={character.attributes}
                />

                <div className='w-full h-1 my-8 bg-gray-200 dark:bg-gray-500 rounded-full'></div>

                <h1 className='text-xl font-medium mt-3 mb-2'>Personality</h1>
                <Profile 
                    type={'personality'}
                    content={character.personality}
                />

                <div className='w-full h-1 my-8 bg-gray-200 dark:bg-gray-500 rounded-full'></div>

                <h1 className='text-xl font-medium mt-3 mb-2'>Sample Dialogues</h1>
                <Profile 
                    type={'dialogSamples'}
                    content={character.dialogSamples}
                />

                <div className='w-full h-1 my-8 bg-gray-200 dark:bg-gray-500 rounded-full'></div>

                <h1 className='text-xl font-medium mt-3 mb-2'>Background Lores</h1>
                <Profile 
                    type={'backgroundLore'}
                    content={character.backgroundLore}
                />
            </>}

            {!character.isInitialised && <div className='w-100 flex items-center justify-center mt-5'>
                <button
                className={`btn relative mr-2 mt-3 ${generating ? 'cursor-not-allowed opacity-40 btn-gray' : 'btn-primary'}`}
                onClick={() => handleGenerate(false)}
                >
                    <div className='flex items-center justify-center gap-2'>
                        {t('generate')}
                    </div>
                </button>
                <button
                className={`btn relative mr-2 mt-3 ${generating ? 'cursor-not-allowed opacity-40 btn-gray' : 'btn-primary'}`}
                onClick={() => handleGenerate(true)}
                >
                    <div className='flex items-center justify-center gap-2'>
                        {t('generate')} (GPT4)
                    </div>
                </button>
            </div>}
            
          {error !== '' && (
            <div className='w-100 flex items-center justify-center mt-2'>
                <div className='relative py-2 px-3 w-3/5 mt-3 max-md:w-11/12 border rounded-md border-red-500 bg-red-500/10'>
                <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
                    {error}
                </div>
                <div
                    className='text-white absolute top-1 right-1 cursor-pointer'
                    onClick={() => {
                    setError('');
                    }}
                >
                    <CrossIcon />
                </div>
                </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }
);

export default Character;
