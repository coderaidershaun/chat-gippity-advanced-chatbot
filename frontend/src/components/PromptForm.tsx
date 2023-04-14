type Props = {
  prompt: string;
  errorMsg: string;
  handleSendPrompt: any;
  setPrompt: any;
  isLoading: boolean;
};

function PromptForm({
  prompt,
  handleSendPrompt,
  setPrompt,
  errorMsg,
  isLoading,
}: Props) {
  return (
    <div className="fixed bottom-0 w-full bg-gray-400 border-t">
      <form onSubmit={handleSendPrompt}>
        <div
          className={
            "flex items-center py-6 px-4 " + (isLoading && "opacity-80")
          }
        >
          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={
              "transition-all duration-200 hidden w-14 h-full mr-2 p-3 border outline-none appearance-none " +
              (prompt.length == 0
                ? "bg-gray-300 text-gray-500 border-gray-500"
                : "bg-sky-500 text-white border-sky-700")
            }
          >
            GO
          </button>

          {/* Input */}
          <input
            type="text"
            disabled={isLoading}
            className={
              "px-5 py-3 border w-full placeholder:italic placeholder:text-gray-400 outline-none appearance-none " +
              (isLoading && "animate-pulse")
            }
            placeholder={isLoading ? "chatting..." : "chat..."}
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
