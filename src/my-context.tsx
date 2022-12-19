import React, { createContext, useState } from "react";

interface Props {
  children?: React.ReactNode;
}

export const MyContext = createContext<any>(undefined);

export const MyProvider: React.FC<Props> = ({ children }) => {
  const [myCtx, setMyCtx] = useState<{[key: string]:any}>({});

  let state = {
    myCtx,
    setMyCtx
  };

  //wrap the application in the provider
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>;
};
