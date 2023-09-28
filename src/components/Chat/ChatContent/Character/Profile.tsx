import React, { useEffect, useState } from 'react';

import ProfileContentView from './View/ProfileContentView';
import ProfileEditView from './View/ProfileEditView';
import { CharacterProfile } from '@type/character';

const Profile = ({
    type,
    content,
    isEdit=false
}: {
    type: CharacterProfile;
    content: string;
    isEdit?: boolean;
}) => {
  const [_isEdit, _setIsEdit] = useState<boolean>(isEdit);
  const canGenerate = type !== 'description';

  useEffect(() => {
    if (content.length == 0) {
      _setIsEdit(true);
    } else {
      _setIsEdit(false);
    }
  }, [content])

  return (
    <div className='relative flex flex-col gap-2 md:gap-3 lg:w-[calc(100%-115px)]'>
      {_isEdit ? (
        <ProfileEditView
            type={type}
            content={content}
            setIsEdit={_setIsEdit}
            canGenerate={canGenerate}
        />
      ) : (
        <ProfileContentView
            content={content}
            setIsEdit={_setIsEdit}
        />
      )}
    </div>
  );
};

export default Profile;
