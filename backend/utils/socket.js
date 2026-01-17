const socketIo = require("socket.io");
const {
  handleKitchenRequests,
  handleTakeoutRequests,
  handleRemoveKitchenTicket,
  handleRemoveTakeoutTicket,
  handleCompletedOrdersRequests,
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
    handleCompletedOrdersRequests(socket);
    handleRemoveKitchenTicket(socket);
    handleRemoveTakeoutTicket(socket);

    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
};

module.exports = socketIoSetup;
