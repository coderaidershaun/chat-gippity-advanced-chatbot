import { useState, useEffect, useCallback, useRef } from "react";
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

  const { routeId, fetchRouteId } = useCallRoute();
  const { executeTask, files } = useCallExecute();

  const messagesEndRef: React.RefObject<HTMLDivElement> = useRef(null);

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
    setIsLoading(true);

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

    setIsLoading(false);
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
      <Header />

      {/* Messages */}
      <section className="flex-grow overflow-y-auto bg-white">
        <MessageResponses messages={messages} />
      </section>

      {/* Footer */}
      <footer className="">
        <FileScroller files={files} />
        <PromptForm
          prompt={prompt}
          handleSendPrompt={handleSendPrompt}
          setPrompt={setPrompt}
          errorMsg={errorMsg}
          isLoading={isLoading}
        />
        {/* Dummy element for auto scroll */}
        <div ref={messagesEndRef}></div>
      </footer>
    </div>
  );
}

export default Controller;
