import React from 'react';
import useStore from '@store/store';

import { Role } from '@type/chat';
import Avatar from './Avatar';
import { CharacterInterface } from '@type/character';
import MessageContent from '../Message/MessageContent';

const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const Character = React.memo(
  ({
    role,
    character,
  }: {
    role: Role;
    character?: CharacterInterface;
  }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const advancedMode = useStore((state) => state.advancedMode);

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
            {/* {advancedMode &&
              <RoleSelector
                role={role}
                messageIndex={messageIndex}
                sticky={sticky}
              />} */}
            <MessageContent
              role={role}
              content={character?.prompt ?? ''}
              messageIndex={0}
              sticky={false}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Character;
