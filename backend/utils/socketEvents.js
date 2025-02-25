const { ticketManager } = require("./ticketManager");

exports.handleKitchenRequests = (socket) => {
  socket.on("request-kitchen-ticket", () => {
    socket.emit("get-kitchen-ticket", ticketManager.getKitchenTicket());
    socket.broadcast.emit(
      "get-kitchen-ticket",
      ticketManager.getKitchenTicket()
    );
  });
};

exports.handleTakeoutRequests = (socket) => {
  socket.on("request-takeout-ticket", () => {
    socket.emit("get-takeout-ticket", ticketManager.getTakeoutTicket());
    socket.broadcast.emit(
      "get-takeout-ticket",
      ticketManager.getTakeoutTicket()
    );
  });
};

exports.handleRemoveKitchenTicket = (socket) => {
  socket.on("remove-kitchen-ticket", (id) => {
    ticketManager.removeKitchenTicket(id);
    socket.emit("get-kitchen-ticket", ticketManager.getKitchenTicket()); // send to self
    socket.broadcast.emit(
      "get-kitchen-ticket",
      ticketManager.getKitchenTicket()
    );
  });
};

exports.handleRemoveTakeoutTicket = (socket) => {
  socket.on("remove-takeout-ticket", (id) => {
    ticketManager.removeTakeoutTicket(id);
    socket.emit("takeout-send", ticketManager.getTakeoutTicket());
  });
};
