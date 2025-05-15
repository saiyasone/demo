import { motion } from "framer-motion";

function Scale(props) {
  const { isVisible } = props;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, y: 0, scale: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.3,
        scale: {
          type: "spring",
          visualDuration: 0.4,
          bounce: 0.3,
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
      <p>Hello, I am scale</p>
    </motion.div>
  );
}

export default Scale;
