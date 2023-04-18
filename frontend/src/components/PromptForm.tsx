import { useState, useEffect } from "react";
import Send from "../assets/send";

type Props = {
  prompt: string;
  errorMsg: string;
  handleSendPrompt: any;
  setPrompt: any;
  isLoading: boolean;
  isExecuting: boolean;
};

function PromptForm({
  prompt,
  handleSendPrompt,
  setPrompt,
  errorMsg,
  isLoading,
  isExecuting,
}: Props) {
  const [placeholderText, setPlaceholderText] = useState("chat...");

  // Handle placeholder text
  useEffect(() => {
    let placeholder = "chat...";
    if (isLoading) {
      placeholder = "gippity typing...";
      setPlaceholderText("waiting...");
    } else if (isExecuting) {
      placeholder = "working request...";
    }

    // Delay changing text
    const timeout = setTimeout(() => {
      setPlaceholderText(placeholder);
    }, 300);

    // Clean
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, isExecuting]);

  return (
    <div className="relative w-full bg-gray-900">
      <form onSubmit={handleSendPrompt}>
        <div
          className={
            "flex items-center py-6 px-4 " +
            ((isLoading || isExecuting) && "opacity-80")
          }
        >
          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || isExecuting}
            className={
              "transition-all duration-200 absolute right-0 w-14 h-full mr-2 p-3 outline-none appearance-none " +
              (prompt.length == 0
                ? "text-gray-500"
                : "text-sky-500 hover:text-sky-600")
            }
          >
            <Send />
          </button>

          {/* Input */}
          <input
            type="text"
            disabled={isLoading || isExecuting}
            className={
              "pl-5 py-3 pr-12 border font-light border-gray-600 focus:border-sky-500 rounded w-full text-gray-200 bg-gray-800 placeholder:italic placeholder:text-gray-400 outline-none appearance-none " +
              ((isLoading || isExecuting) && "animate-pulse")
            }
            placeholder={placeholderText}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </form>
      {errorMsg.length > 0 && (
        <div className="text-center mb-12 text-red-600">{errorMsg}</div>
      )}
    </div>
  );
}

export default PromptForm;
