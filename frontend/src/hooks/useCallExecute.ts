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

export interface IBlobDetails {
  url: string;
  filename: string;
  fileExt: string;
}

const useCallExecute = () => {
  const [files, setFiles] = useState<IBlobDetails[]>([]);

  // Send execution request to backend
  const executeTask = async (
    body: Body,
    msgs: IMessage[],
    setMessages: any,
    setErrMsg: any,
    responseType: string
  ) => {
    let blobs = [...files];

    // Send execution request
    await axios
      .post("http://localhost:8000/api/execute", body, {
        withCredentials: true,
        responseType: "arraybuffer",
      })
      // Handle execution success
      .then((response) => {
        if (response.status == 200) {
          const contentType = response.headers["content-type"];

          // Handle receivingfile
          if (contentType.includes("application/octet-stream")) {
            // Extract filename extension
            const contentDisposition = response.headers["content-disposition"];
            const filenameMatch = contentDisposition.match(/filename="(.+)?"/i);
            const filename = filenameMatch
              ? filenameMatch[1]
              : "default-filename.txt";
            const fname = filename.split(".")[0];
            const fileExt = filename.split(".")[1];

            // Create blob url to file
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const blbObj = {
              url: url,
              filename: fname,
              fileExt: fileExt,
            };
            blobs.push(blbObj);
            setFiles(blobs);

            // Indicate file is ready
            msgs.push({ role: "assistant", content: "Here you go" });
            setMessages(msgs);
          } else {
            console.error("Unsupported content type:", contentType);
          }
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
  return { executeTask, files };
};

export default useCallExecute;
