

import { createContext, useReducer } from 'react'

export const UserContext = createContext(null)
export const UserDispatchContext = createContext(null)

export function UserProvider({ children }) {
  const [userInfo, dispatch] = useReducer(
    userInfoReducer,
    initialUserInfo
  )


  return (
    <UserContext.Provider value={userInfo}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  )
}

function userInfoReducer(userInfo, action) {
  switch (action.type) {
    case 'change': {
        userInfo[action.key] = action.value
        return {...userInfo}
    }
    case 'setUserInfo': {
        return {...userInfo, ...action.value}
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

const initialUserInfo = {
  "uuid": "",
  "name": "",
  "avatar": "",
  "login": ""
}