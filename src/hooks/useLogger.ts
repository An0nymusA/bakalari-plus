const filter = "INDE".split("");

// Define the log interface
interface log {
  info: (...messages: any[]) => void;
  navigation: (...messages: any[]) => void;
  debug: (...messages: any[]) => void;
  space: () => void;
}

const useLogger = (pageName: string, context?: string) => {
  const log = (level: string, message: any, prefix: string = "") => {
    if (!filter.includes(level)) return;

    if (prefix === "\n") console.log();

    console.log(
      `(${level})-${context ? `[${context}]-` : ""}[${pageName}]:`,
      message
    );
  };

  // Return the log functions
  return {
    log: {
      // Log an info message
      info: (...messages: any[]) => log("I", messages.join(" | ")),

      // Log a navigation message with a new line prefix
      navigation: (...messages: any[]) => log("N", messages.join(" | "), "\n"),

      // Log a debug message
      debug: (...messages: any[]) => log("D", messages.join(" | ")),

      // Log an error message with optional error details
      error: (errorMessage: string, error?: any) => {
        if (error) {
          log("E", errorMessage, typeof error);
          console.log(JSON.stringify(error, null, 4));
          return;
        }
        log("E", errorMessage);
      },

      // Print a separator line
      space: () => console.log("--------------------"),
    },
  };
};

export default useLogger;
export type { log };
