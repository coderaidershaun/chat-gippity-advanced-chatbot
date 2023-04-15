import { useState, useEffect, useCallback, useRef } from "react";
import useCallRoute from "../hooks/useCallRoute";
import useCallExecute from "../hooks/useCallExecute";
import PromptForm from "./PromptForm";

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
  const { fileBlobUrl, executeTask } = useCallExecute();

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

    // Construct body with last 5 messages
    const recentMessages = messages.length > 5 ? messages.slice(-5) : messages;
    const body = {
      routeId,
      messages: recentMessages,
    };

    // Send execution request
    console.log("Executing task...");
    await executeTask(body, msgs, setMessages, setErrMsg);

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
    <div>
      <div className="flex flex-col overflow-y-scroll bg-gray-100 h-screen">
        <div className="mb-[150px]">
          {messages.map((msg, index) => {
            return (
              <div key={msg.content + index}>
                {msg.role == "user" ? (
                  <div className="bg-gradient-to-br from-gray-300 to-gray-350 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-gray-900 shadow">
                    <div className="font-medium italic text-xs">Shaun</div>
                    <div className="text-base">{msg.content}</div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-indigo-500 to-sky-500 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-white ml-auto shadow">
                    <div className="font-medium italic text-xs text-right">
                      Gippity
                    </div>
                    <div className="text-base">{msg.content}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <PromptForm
          prompt={prompt}
          handleSendPrompt={handleSendPrompt}
          setPrompt={setPrompt}
          errorMsg={errorMsg}
          isLoading={isLoading}
        />

        {/* Dummy element for auto scroll */}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

export default Controller;
