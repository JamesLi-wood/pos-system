const socketIo = require("socket.io");
const {
  handleKitchenRequests,
  handleTakeoutRequests,
  handleRemoveKitchenTicket,
  handleRemoveTakeoutTicket,
} = require("./socketEvents");

const socketIoSetup = async (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    handleKitchenRequests(socket);
    handleTakeoutRequests(socket);
    handleRemoveKitchenTicket(socket);
    handleRemoveTakeoutTicket(socket);
  });
};

module.exports = socketIoSetup;
