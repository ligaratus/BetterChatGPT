
export type CharacterProfile = 'description' | 'attributes' | 'personality' | 'dialogSamples' | 'backgroundLore';
export type DialogRole = 'user' | 'character';

export interface DialogMessage {
    role: DialogRole;
    content: string;
}

export interface DialogInterface {
    messages: DialogMessage[];
}

export interface CharacterInterface {
    id: string;
    name: string;
    description: string;
    attributes: string;
    personality: string;
    // dialogSamples: DialogInterface[];
    dialogSamples: string;
    backgroundLore: string;
    isInitialised: boolean
}
