import React from "react";
import { motion } from "framer-motion";
import { IMessage } from "./Controller";
import AnimationTyping from "./AnimationTyping";
import AnimationBuilding from "./AnimationBuilding";

type Props = {
  messages: IMessage[];
  isLoading: boolean;
  isExecuting: boolean;
};

function MessageResponses({ messages, isLoading, isExecuting }: Props) {
  return (
    <div className="mb-[150px]">
      {messages.map((msg, index) => {
        return (
          <div key={msg.content + index}>
            {msg.role == "user" ? (
              <div className="bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-gray-900">
                <div className="font-medium italic text-xs">Shaun</div>
                <div className="text-base font-light">{msg.content}</div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-sky-500 to-sky-500 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-white ml-auto shadow">
                <div className="font-medium italic text-xs text-right">
                  Gippity
                </div>
                <div className="text-base font-light">{msg.content}</div>
              </div>
            )}
          </div>
        );
      })}

      {/* Typing animation */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimationTyping />
        </motion.div>
      )}

      {/* Executing animation */}
      {isExecuting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimationBuilding />
        </motion.div>
      )}
    </div>
  );
}

export default MessageResponses;
