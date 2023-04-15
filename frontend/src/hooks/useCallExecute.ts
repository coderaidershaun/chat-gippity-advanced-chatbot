import { useState } from "react";
import { IMessage } from "../components/Controller";
import axios from "axios";

/**
 * Sends routeId and recent messages to backend
 * Backend executes the requered task
 * Returns file or confirmation of task being complete
 */

const BOT_ROLE = "assistant";

interface Body {
  routeId: number;
  messages: IMessage[];
}

const useCallExecute = () => {
  const [fileBlobUrl, setFileBlobUrl] = useState(0);

  // Send execution request to backend
  const executeTask = async (
    body: Body,
    msgs: IMessage[],
    setMessages: any,
    setErrMsg: any
  ) => {
    await axios
      .post("http://localhost:8000/api/execute", body, {
        withCredentials: true,
      })
      // Handle execution success
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
        } else {
          msgs.push({
            role: BOT_ROLE,
            content:
              "Woops, something went wrong with the execution of your request.",
          });
        }
      })
      // Handle error
      .catch((err) => {
        console.log(err);
      });
  };

  // Return result
  return { fileBlobUrl, executeTask };
};

export default useCallExecute;
