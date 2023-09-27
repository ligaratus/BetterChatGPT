
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
    prompt: string;
    attributes: string;
    personality: string;
    dialogSamples: DialogInterface[];
    backgroundLore: string;
}
