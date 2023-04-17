import { useState } from "react";
import { IMessage } from "../components/Controller";
import axios from "axios";

/**
 * Sends messages to backend.
 * Backend decides what route to assign to messages
 * Returns route to logic for further processing
 */

const BOT_ROLE = "assistant";

const useCallRoute = () => {
  const [routeId, setRouteId] = useState(0);

  // Send routing request to backend
  const fetchRouteId = async (
    msgs: IMessage[],
    setMessages: any,
    setErrMsg: any
  ) => {
    // Reset RouteId
    setRouteId(0);

    // Send Routing request
    await axios
      .post("http://localhost:8000/api/router", msgs, {
        withCredentials: true,
      })
      // Handle routing success
      .then((res) => {
        if (res.status == 200) {
          if (Object.keys(res.data).includes("routing")) {
            // Append response to messages
            if (res.data.routing.length > 1) {
              msgs.push({
                role: BOT_ROLE,
                content: res.data.routing[1],
              });

              // Provide route ID
              const routeResponseId = Number(res.data.routing[0]);
              setRouteId(routeResponseId);

              // Handle message update
              if (routeResponseId == 0) {
                setMessages(msgs);
              }
            } else {
              msgs.push({
                role: BOT_ROLE,
                content: "Something went wrong.",
              });
            }
          }
        } else {
          msgs.push({
            role: BOT_ROLE,
            content: "Woops, something went wrong.",
          });
        }
      })
      // Handle routing error
      .catch((err) => {
        if (Object.keys(err.response.data).includes("detail")) {
          setErrMsg(err.response.data.detail);
        } else {
          console.error(err);
          setErrMsg("Something went wrong");
        }
      });
  };

  // Return result
  return { routeId, fetchRouteId };
};

export default useCallRoute;
