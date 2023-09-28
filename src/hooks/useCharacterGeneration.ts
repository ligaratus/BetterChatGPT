import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { ChatInterface, MessageInterface } from '@type/chat';
import { getChatCompletion, getChatCompletionFunctionCall, getChatCompletionStream } from '@api/api';
import { parseEventSource } from '@api/helper';
import { limitMessageTokens, updateTotalTokenUsed } from '@utils/messageUtils';
import { _defaultChatConfig, bestModel } from '@constants/chat';
import { officialAPIEndpoint } from '@constants/auth';
import { functions } from 'lodash';

const useCharacterGeneration = () => {
  const { t, i18n } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const apiKey = useStore((state) => state.apiKey);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  // const generateTitle = async (
  //   message: MessageInterface[]
  // ): Promise<string> => {
  //   let data;
  //   try {
  //     if (!apiKey || apiKey.length === 0) {
  //       // official endpoint
  //       if (apiEndpoint === officialAPIEndpoint) {
  //         throw new Error(t('noApiKeyWarning') as string);
  //       }

  //       // other endpoints
  //       data = await getChatCompletion(
  //         useStore.getState().apiEndpoint,
  //         message,
  //         _defaultChatConfig
  //       );
  //     } else if (apiKey) {
  //       // own apikey
  //       data = await getChatCompletion(
  //         useStore.getState().apiEndpoint,
  //         message,
  //         _defaultChatConfig,
  //         apiKey
  //       );
  //     }
  //   } catch (error: unknown) {
  //     throw new Error(`Error generating title!\n${(error as Error).message}`);
  //   }
  //   return data.choices[0].message.content;
  // };

  // const handleSubmit = async () => {
  //   const chats = useStore.getState().chats;
  //   if (generating || !chats) return;

  //   const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));

  //   updatedChats[currentChatIndex].messages.push({
  //     role: 'assistant',
  //     content: '',
  //   });
  //   const character = updatedChats[currentChatIndex].character;

  //   setChats(updatedChats);
  //   setGenerating(true);

  //   try {
  //     let stream;
  //     if (chats[currentChatIndex].messages.length === 0)
  //       throw new Error('No messages submitted!');

  //     const messages = limitMessageTokens(
  //       [{
  //         role: 'system',
  //         content: character.prompt,
  //       }, ...chats[currentChatIndex].messages],
  //       chats[currentChatIndex].config.max_tokens,
  //       chats[currentChatIndex].config.model
  //     );
  //     if (messages.length === 0) throw new Error('Message exceed max token!');

  //     // no api key (free)
  //     if (!apiKey || apiKey.length === 0) {
  //       // official endpoint
  //       if (apiEndpoint === officialAPIEndpoint) {
  //         throw new Error(t('noApiKeyWarning') as string);
  //       }

  //       // other endpoints
  //       stream = await getChatCompletionStream(
  //         useStore.getState().apiEndpoint,
  //         messages,
  //         chats[currentChatIndex].config
  //       );
  //     } else if (apiKey) {
  //       // own apikey
  //       stream = await getChatCompletionStream(
  //         useStore.getState().apiEndpoint,
  //         messages,
  //         chats[currentChatIndex].config,
  //         apiKey
  //       );
  //     }

  //     if (stream) {
  //       if (stream.locked)
  //         throw new Error(
  //           'Oops, the stream is locked right now. Please try again'
  //         );
  //       const reader = stream.getReader();
  //       let reading = true;
  //       let partial = '';
  //       while (reading && useStore.getState().generating) {
  //         const { done, value } = await reader.read();
  //         const result = parseEventSource(
  //           partial + new TextDecoder().decode(value)
  //         );
  //         partial = '';

  //         if (result === '[DONE]' || done) {
  //           reading = false;
  //         } else {
  //           const resultString = result.reduce((output: string, curr) => {
  //             if (typeof curr === 'string') {
  //               partial += curr;
  //             } else {
  //               const content = curr.choices[0].delta.content;
  //               if (content) output += content;
  //             }
  //             return output;
  //           }, '');

  //           const updatedChats: ChatInterface[] = JSON.parse(
  //             JSON.stringify(useStore.getState().chats)
  //           );
  //           const updatedMessages = updatedChats[currentChatIndex].messages;
  //           updatedMessages[updatedMessages.length - 1].content += resultString;
  //           setChats(updatedChats);
  //         }
  //       }
  //       if (useStore.getState().generating) {
  //         reader.cancel('Cancelled by user');
  //       } else {
  //         reader.cancel('Generation completed');
  //       }
  //       reader.releaseLock();
  //       stream.cancel();
  //     }

  //     // update tokens used in chatting
  //     const currChats = useStore.getState().chats;
  //     const countTotalTokens = useStore.getState().countTotalTokens;

  //     if (currChats && countTotalTokens) {
  //       const model = currChats[currentChatIndex].config.model;
  //       const messages = currChats[currentChatIndex].messages;
  //       updateTotalTokenUsed(
  //         model,
  //         messages.slice(0, -1),
  //         messages[messages.length - 1]
  //       );
  //     }

  //     // generate title for new chats
  //     if (
  //       useStore.getState().autoTitle &&
  //       currChats &&
  //       !currChats[currentChatIndex]?.titleSet
  //     ) {
  //       const messages_length = currChats[currentChatIndex].messages.length;
  //       const assistant_message =
  //         currChats[currentChatIndex].messages[messages_length - 1].content;
  //       const user_message =
  //         currChats[currentChatIndex].messages[messages_length - 2].content;

  //       const message: MessageInterface = {
  //         role: 'user',
  //         content: `Generate a title in less than 6 words for the following message (language: ${i18n.language}):\n"""\nUser: ${user_message}\nAssistant: ${assistant_message}\n"""`,
  //       };

  //       let title = (await generateTitle([message])).trim();
  //       if (title.startsWith('"') && title.endsWith('"')) {
  //         title = title.slice(1, -1);
  //       }
  //       const updatedChats: ChatInterface[] = JSON.parse(
  //         JSON.stringify(useStore.getState().chats)
  //       );
  //       updatedChats[currentChatIndex].title = title;
  //       updatedChats[currentChatIndex].titleSet = true;
  //       setChats(updatedChats);

  //       // update tokens used for generating title
  //       if (countTotalTokens) {
  //         const model = _defaultChatConfig.model;
  //         updateTotalTokenUsed(model, [message], {
  //           role: 'assistant',
  //           content: title,
  //         });
  //       }
  //     }
  //   } catch (e: unknown) {
  //     const err = (e as Error).message;
  //     console.log(err);
  //     setError(err);
  //   }
  //   setGenerating(false);
  // };
  function removeTrailingCommasAndNormalize(str: string) {
    let inString = false;
    let cleanedStr = '';
  
    for (let i = 0; i < str.length; i++) {
      const currentChar = str[i];
      if (currentChar === '"' && (i === 0 || str[i - 1] !== '\\')) {
        inString = !inString;
      }
  
      if (!inString && currentChar === ',' && (str[i + 1] === '}' || str[i + 1] === ']')) {
        continue;
      }
  
      if (inString) {
        switch (currentChar) {
          case '\b':
            cleanedStr += '\\b';
            break;
          case '\f':
            cleanedStr += '\\f';
            break;
          case '\n':
            cleanedStr += '\\n';
            break;
          case '\r':
            cleanedStr += '\\r';
            break;
          case '\t':
            cleanedStr += '\\t';
            break;
          case '"':
            cleanedStr += '\\"';
            break;
          case '\\':
            cleanedStr += '\\\\';
            break;
          default:
            cleanedStr += currentChar;
        }
      } else {
        cleanedStr += currentChar;
      }
    }
  
    return cleanedStr;
  }
    
  const generateCharacterProfile = async (useBestModel: boolean) => {
    const chats = useStore.getState().chats;
    if (generating || !chats) return;

    const character = chats[currentChatIndex].character;
    if (!character) return;
    
    setGenerating(true);
    
    let data;
    let chatConfig = _defaultChatConfig
    if (useBestModel) chatConfig.model = bestModel
    const content = `${character.name}\n\n${character.description}`
    let characterData;
    
    try {
      data = await getChatCompletionFunctionCall(
        useStore.getState().apiEndpoint,
        [{
          role: 'system',
          content: content
        }],
        chatConfig,
        [
          {
            "name": "generate_character_profile",
            "description": "Based on the given prompt, generate a character profile into the given format",
            "parameters": {
                "type": "object",
                "properties": {
                    "basic_attributes": {
                      "type": "string",
                      "description": "This section includes immutable or quasi-immutable traits such as birthdate, height, and eye color, as well as more dynamic features like favorite foods or hobbies. These aspects serve as foundational elements that are unlikely to change significantly over time.",
                    },
                    "personality_traits": {
                      "type": "string",
                      "description": "This section delves into the character's inner workings, covering temperament, how they typically interact with others, their core beliefs, and even speech patterns. This offers a more comprehensive understanding of who the character is as an individual. The first paragraph describe her inner profile, while the second paragraph describes the character's communication style. Separate them with double line breaks"
                    },
                    "dialogue_samples": {
                      "type": "string",
                      "description": "This segment offers snippets of dialogues involving the character, whether with friends, foes, or neutral parties. These samples serve to illustrate how the character's psychological traits manifest in social situations, showing instead of just telling. It should be in this format: \"Human: Hello, how are you?\nCharacter: I'm fine. How about you?\". Give at least 3 expressive samples, separated by double line breaks."
                    },
                    "background_lore": {
                      "type": "string",
                      "description": "This section is for any additional narrative or background information that enriches the character's identity. It can include details on their upbringing, important life events, or broader societal factors affecting them, thus providing context and depth. Provide at least 5 details, separated by double line breaks."
                    },
                },
                "required": ["basic_attributes", "personality_traits", "dialogue_samples", "background_lore"],
              },
          },
        ],
        'generate_character_profile',
        apiKey
      );

      characterData = JSON.parse(data.choices[0].message.function_call.arguments)
    } catch (error: unknown) {
      setGenerating(false);
      throw new Error(`Error generating character profile!\n${(error as Error).message}`);
    }

    character.attributes = characterData.basic_attributes;
    character.personality = characterData.personality_traits;
    character.dialogSamples = characterData.dialogue_samples;
    character.backgroundLore = characterData.background_lore;
    character.isInitialised = true;

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
    updatedChats[currentChatIndex].character = character;
    setChats(updatedChats);

    setGenerating(false);
    
    return data.choices[0].message.function_call.arguments
  }

  return { generateCharacterProfile, error };
};

export default useCharacterGeneration;
