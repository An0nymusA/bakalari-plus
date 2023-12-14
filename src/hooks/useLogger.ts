const useLogger = (pageName: string, context?: string) => {
  const log = (...messages: any[]) => {
    console.log(
      `${context == null ? "" : `[${context}]-`}[${pageName}]:`,
      messages.join(" | ")
    );
  };

  return { log };
};

export default useLogger;
