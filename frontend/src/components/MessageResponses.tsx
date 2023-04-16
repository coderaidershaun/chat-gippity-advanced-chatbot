import React from "react";
import { IMessage } from "./Controller";

type Props = {
  messages: IMessage[];
};

function MessageResponses({ messages }: Props) {
  return (
    <div className="mb-[150px]">
      {messages.map((msg, index) => {
        return (
          <div key={msg.content + index}>
            {msg.role == "user" ? (
              <div className="bg-gradient-to-br from-gray-300 to-gray-350 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-gray-900 shadow">
                <div className="font-medium italic text-xs">Shaun</div>
                <div className="text-base font-light">{msg.content}</div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-500 to-sky-500 rounded-lg px-4 py-2 text-sm max-w-xs m-5 text-white ml-auto shadow">
                <div className="font-medium italic text-xs text-right">
                  Gippity
                </div>
                <div className="text-base font-light">{msg.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MessageResponses;
