import { IBlobDetails } from "../hooks/useCallExecute";
import { motion } from "framer-motion";
import DownloadSVG from "../assets/download";

type Props = {
  files: IBlobDetails[];
};

function FileScroller({ files }: Props) {
  const slideInFromRightVariant = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div className="transition-all duration-300 flex flex-row justify-end w-full overflow-x-scroll hide-scrollbar bg-gray-800">
      {files.map((blb, index) => {
        return (
          <div key={blb.url + index}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInFromRightVariant}
            >
              <a
                className={
                  "block bg-gradient-to-br h-16 min-w-[4rem] mr-2 my-2 border border-sky-500 rounded text-center hover:opacity-80 " +
                  (blb.fileExt == "txt"
                    ? "from-sky-300 to-fuchsia-500"
                    : "from-green-300 to-sky-500")
                }
                href={blb.url}
                download="file.txt"
              >
                <div className="text-sm mt-2 text-gray-700 font-bold">
                  .{blb.fileExt}
                </div>
                <div className="text-xs font-light">
                  <DownloadSVG />
                </div>
              </a>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default FileScroller;
