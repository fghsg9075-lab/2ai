import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Load initial state from localStorage or defaults
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('prompts');
    return saved ? JSON.parse(saved) : {
      free: "Provide a concise summary of the topic: {topic}. Keep it simple for a class {class} student.",
      premium: "Provide a detailed, in-depth explanation of the topic: {topic}. Include examples and advanced concepts for a class {class} student.",
      mcq: "Generate 5 multiple choice questions for the topic: {topic} for class {class}. Format as JSON."
    };
  });

  const [specialSyllabus, setSpecialSyllabus] = useState(() => {
    const saved = localStorage.getItem('specialSyllabus');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem('specialSyllabus', JSON.stringify(specialSyllabus));
  }, [specialSyllabus]);

  // Actions
  const updateApiKey = (key) => setApiKey(key);
  
  const updatePrompts = (newPrompts) => setPrompts(prev => ({ ...prev, ...newPrompts }));

  const addSpecialSubject = (subjectName) => {
    setSpecialSyllabus(prev => [...prev, { id: Date.now(), name: subjectName, topics: [] }]);
  };

  const addSpecialTopic = (subjectId, topicName) => {
    setSpecialSyllabus(prev => prev.map(sub => 
      sub.id === subjectId 
        ? { ...sub, topics: [...sub.topics, { id: Date.now(), name: topicName }] }
        : sub
    ));
  };
  
  const deleteSpecialSubject = (id) => {
      setSpecialSyllabus(prev => prev.filter(s => s.id !== id));
  }

  const value = {
    apiKey,
    prompts,
    specialSyllabus,
    updateApiKey,
    updatePrompts,
    addSpecialSubject,
    addSpecialTopic,
    deleteSpecialSubject
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
