import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCallRoute from "../hooks/useCallRoute";
import useCallExecute from "../hooks/useCallExecute";
import Header from "./Header";
import PromptForm from "./PromptForm";
import MessageResponses from "./MessageResponses";
import FileScroller from "./FileScroller";

export interface IMessage {
  role: string;
  content: string;
}

function Controller() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [errorMsg, setErrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showFiles, setShowFiles] = useState(true);

  const { routeId, fetchRouteId } = useCallRoute();
  const { executeTask, files, setFiles } = useCallExecute();

  const messagesEndRef: React.RefObject<HTMLDivElement> = useRef(null);

  // Reset
  const handleReset = () => {
    setPrompt("");
    setMessages([]);
    setErrMsg("");
    setFiles([]);
  };

  // Animate file bar
  const slideDownVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  // Toggle showing files
  const toggleFiles = () => {
    setShowFiles(!showFiles);
  };

  // Auto scroll
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Send initial chat prompt to get route ID
  const handleSendPrompt = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate
    if (prompt.length === 0) {
      setErrMsg("Too few characters");
    }

    // Initialize
    const msgs = [...messages];
    setPrompt("");
    setErrMsg("");

    // Add user message
    msgs.push({ role: "user", content: prompt });
    setMessages(msgs);

    // Make call
    console.log("Fetching route Id...");
    await fetchRouteId(msgs, setMessages, setErrMsg);

    // Clean up
    setPrompt("");
    setIsLoading(false);
  };

  // Send initial chat prompt to get route ID
  const handleSendExecution = useCallback(async () => {
    setIsExecuting(true);

    // Initialize
    let msgs = [...messages];
    const responseType = [1, 2, 4].includes(routeId) ? "blob" : "json";

    // Construct body with last 5 messages
    const recentMessages = messages.length > 5 ? messages.slice(-5) : messages;
    const body = {
      routeId,
      messages: recentMessages,
    };

    // Send execution request
    console.log("Executing task...");
    await executeTask(body, msgs, setMessages, setErrMsg, responseType);

    setIsExecuting(false);
  }, [routeId, messages]);

  // Handle routeId change
  // If routeId is not a general chat (0), then send execution
  useEffect(() => {
    if (routeId != 0) {
      handleSendExecution();
    }
  }, [routeId]);

  // Trigger auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex flex-col">
      <Header handleReset={handleReset} />

      {/* Messages */}
      <section className="relative flex-grow overflow-y-auto bg-message-box hide-scrollbar">
        <div className="relative inset-0 bg-black bg-opacity-70 min-h-screen pb-14 pt-5">
          <MessageResponses
            messages={messages}
            isLoading={isLoading}
            isExecuting={isExecuting}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-700">
        {files.length > 0 && (
          <button
            onClick={toggleFiles}
            className="transition-all duration-300 absolute bg-sky-500 left-2 -top-[26px] z-50 px-4 hover:px-5 rounded-t"
          >
            {showFiles ? (
              <div className="transition-all duration-500 rotate-180 py-0.5">
                ^
              </div>
            ) : (
              <div className="pt-0.5">^</div>
            )}
          </button>
        )}
        <AnimatePresence>
          {files.length > 0 && showFiles && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideDownVariants}
              transition={{ duration: 0.3 }}
            >
              <FileScroller files={files} />
            </motion.div>
          )}
        </AnimatePresence>

        <PromptForm
          prompt={prompt}
          handleSendPrompt={handleSendPrompt}
          setPrompt={setPrompt}
          errorMsg={errorMsg}
          isLoading={isLoading}
          isExecuting={isExecuting}
        />
        {/* Dummy element for auto scroll */}
        <div ref={messagesEndRef}></div>
      </footer>
    </div>
  );
}

export default Controller;
