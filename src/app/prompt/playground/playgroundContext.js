

import { createContext, useReducer, useEffect } from 'react'

// import { store } from '@/util/store'



export const PlaygroundContext = createContext(null)
export const PlaygroundDispatchContext = createContext(null)

export function PlaygroundProvider({ children }) {

  const [playground, dispatch] = useReducer(
    playgroundReducer,
    initialPlaygroundChat
  )


  return (
    <PlaygroundContext.Provider value={playground}>
      <PlaygroundDispatchContext.Provider value={dispatch}>
        {children}
      </PlaygroundDispatchContext.Provider>
    </PlaygroundContext.Provider>
  )
}

function playgroundReducer(playground, action) {
  switch (action.type) {
    case 'change': {
        playground[action.key] = action.value
        return {...playground}
    }
    case 'setPromptConfig': {
        return {...playground, ...action.value}
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

// const initialPlayground = {
//     "prompt": "test",
//     "model": "text-davinci-003",
//     "max_tokens": 100,
//     "temperature": 0.3,
//     "top_p": 1,
//     "frequency_penalty": 0,
//     "presence_penalty": 0,
//     "best_of": 1,
//     "echo": true,
//     "logprobs": 0,
//     "stream": true,
//     "stop": [
//         "1"
//     ],
// }
const initialPlaygroundChat = {
  "title": "New conversation",
  "prompt": "",
  "model": "",
  "max_tokens": 256,
  "temperature": 0,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "stream": true,
}
