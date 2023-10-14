import React, { createContext, useState, useContext } from "react";

// Create a context object
const UploadContext = createContext();

// Create a context provider component
export function UploadProvider({ children }) {
  const [isUpload, setIsUpload] = useState(false);

  return (
    <UploadContext.Provider value={{ isUpload, setIsUpload }}>
      {children}
    </UploadContext.Provider>
  );
}

// Create a custom hook to consume the context
export function useUpload() {
  return useContext(UploadContext);
}
