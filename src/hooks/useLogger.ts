const filter = ["I", "N"];

const useLogger = (pageName: string, context?: string) => {
  const log = (level: string, message: any, prefix: string = "") => {
    if (!filter.includes(level)) return;

    if (prefix == "\n") console.log();

    console.log(
      `(${level})-${context == null ? "" : `[${context}]-`}[${pageName}]:`,
      message
    );
  };

  return {
    log: {
      info: (...messages: any[]) => log("I", messages.join("|")),
      navigation: (...messages: any[]) => log("N", messages.join("|"), "\n"),
      debug: (...messages: any[]) => log("D", messages.join("|")),
      space: () => console.log("--------------------"),
    },
  };
};

export default useLogger;
