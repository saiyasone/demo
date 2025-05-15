import { motion } from "framer-motion";

function Circle360(props) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: props.isVisible ? 360 : 0 }}
      transition={{
        duration: 0.1,
        rotate: {
          type: "spring",
          visualDuration: 0.4,
          bounce: 0.1,
        },
      }}
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: "skyblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        margin: "40px auto",
      }}
    >
      <p>Hello, I am spin!</p>
    </motion.div>
  );
}

export default Circle360;
