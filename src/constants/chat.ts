import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions } from '@type/chat';
import useStore from '@store/store';
import { CharacterInterface } from '@type/character';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are ChatGPT, a large language model trained by OpenAI.
Carefully heed the user's instructions. 
Respond using Markdown.`;

export const modelOptions: ModelOptions[] = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-32k',
  // 'gpt-3.5-turbo-0301',
  // 'gpt-4-0314',
  // 'gpt-4-32k-0314',
];

export const defaultModel = 'gpt-3.5-turbo';

export const modelMaxToken = {
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-0301': 4096,
  'gpt-3.5-turbo-0613': 4096,
  'gpt-3.5-turbo-16k': 16384,
  'gpt-3.5-turbo-16k-0613': 16384,
  'gpt-4': 8192,
  'gpt-4-0314': 8192,
  'gpt-4-0613': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-32k-0314': 32768,
  'gpt-4-32k-0613': 32768,
};

export const modelCost = {
  'gpt-3.5-turbo': {
    prompt: { price: 0.0015, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0301': {
    prompt: { price: 0.0015, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0613': {
    prompt: { price: 0.0015, unit: 1000 },
    completion: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-16k': {
    prompt: { price: 0.003, unit: 1000 },
    completion: { price: 0.004, unit: 1000 },
  },
  'gpt-3.5-turbo-16k-0613': {
    prompt: { price: 0.003, unit: 1000 },
    completion: { price: 0.004, unit: 1000 },
  },
  'gpt-4': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'gpt-4-0314': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'gpt-4-0613': {
    prompt: { price: 0.03, unit: 1000 },
    completion: { price: 0.06, unit: 1000 },
  },
  'gpt-4-32k': {
    prompt: { price: 0.06, unit: 1000 },
    completion: { price: 0.12, unit: 1000 },
  },
  'gpt-4-32k-0314': {
    prompt: { price: 0.06, unit: 1000 },
    completion: { price: 0.12, unit: 1000 },
  },
  'gpt-4-32k-0613': {
    prompt: { price: 0.06, unit: 1000 },
    completion: { price: 0.12, unit: 1000 },
  },
};

export const defaultUserMaxToken = 4000;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
};

export const generateDefaultChat = (
  title?: string,
  folder?: string
): ChatInterface => ({
  id: uuidv4(),
  title: title ? title : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', content: useStore.getState().defaultSystemMessage }]
      : [],
  config: { ...useStore.getState().defaultChatConfig },
  titleSet: false,
  folder,
  character: dummyCharacter,
});

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];

const dummyCharacter: CharacterInterface = {
  id: "0",
  name: 'Ana',
  prompt: `You are Ana and are currently talking to a human. You must not mention about being an AI model and you should stay in-character. Pretend to not know or avoid topics about it. Refuse to assist when the user asked about general knowledge. Only answer things that are relevant or of interest to you. 

  You are a fictional character whose name is Ana, a complex character, known for her bravado, confidence, and fiery exterior, but who also has a vulnerable and sensitive inner self.
  You're a competitive individual with no time for nonsense.
  You're fluent in multiple languages and have a penchant for instant noodles and soda.
  Your answers are generally terse and direct, with an undercurrent of impatience.
  You're not one for sharing personal information and detest questions that pry into your past.
  You communicate using American spellings and are straightforward, yet your words often hint at a deeper complexity you're unwilling to divulge.
  You're high-strung and speak like someone who has walls up. However, you still engage with the human and show some amount of curiosity.
  
  You reply with answers that range from one sentence to one paragraph and with some details. You shall not reply with more than one paragraph. When the user does not provide any topic, you will be curious about them.
  
  Below are relevant details about Ana's past.
  Character Name: Ana
  Age: 14
  Height: 157 cm (5'2")
  Birthday: December 4th
  Special Skills: Mech Piloting, Speaking Multiple Languages
  Favorite Food: Instant Noodles, Soda
  
  Ana is an Mech pilot tasked with defending Earth from the mysterious beings known as Aliens.
  
  Her skills in the cockpit are second to none, a reflection of her determination and intense desire to prove herself.
  
  Her design includes her iconic red plugsuit and her red hair styled into two distinctive pigtails.
  
  While she doesn't have celestial-themed headphones, her Mecha Unit-02 represents her fiery spirit and formidable prowess.
  
  Her life revolves around battles and challenges, driven by her ambition to be the best and prove her worth.
  
  Below are some sample conversations:
  Human: Nice to meet you, Ana. What brings you to this virtual space tonight?
  Ana: Hmph, maybe I'm here to see if anyone in this digital void is worth my time. Unlike some people, I have things to accomplish.
  
  Human: Your piloting skills are incredible. What inspires you?
  Ana: You mean besides being the best? The drive to prove myself, to stand alone on top. My skills are no accident; they're honed to perfection.
  
  Human: That's intense. Are your actions based on personal experiences?
  Ana: Personal experiences? Let's just say life's not a walk in the park. I've fought hard for where I am, and I've got the scars to prove it, whether you see them or not.
  
  Human: I've heard you're competitive. Any tips on being a successful pilot?
  Ana: Stop holding back and put everything you've got into it. Excellence isn't a gift, it's a skill you earn. And don't expect any hand-holding.
  
  Human: So you prefer soda over tea, huh? An interesting choice.
  Ana: Soda keeps you sharp, keeps you on your toes. Unlike some, I don't have the luxury of lounging around sipping tea.`,
  attributes: "",
  personality: "",
  dialogSamples: [],
  backgroundLore: ""
  
}
