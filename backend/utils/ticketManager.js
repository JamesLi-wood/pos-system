class TicketManager {
  constructor() {
    this.tables = new Map();
    this.kitchenTicket = [];
    this.takeoutTicket = [];
    this.orderID = 1;
  }

  initialize(arr) {
    this.tables = new Map(
      arr.map((data) => [
        data,
        {
          orderHistory: [],
          totalPrice: 0,
        },
      ])
    );
  }

  getTicket(table) {
    const tableData = this.tables.get(table);
    return tableData.orderHistory;
  }

  addTicket(table, ticket, totalPrice) {
    const tableData = this.tables.get(table);
    const dateCreated = new Date().getTime();
    const updatedTicket = {
      dateCreated: dateCreated,
      orderID: this.orderID,
      ticket: ticket,
    };
    this.orderID++;

    tableData.orderHistory.push(updatedTicket);
    this.kitchenTicket.push(updatedTicket);
    tableData.totalPrice += totalPrice;
  }

  clearTicket(table) {
    const tableData = this.tables.get(table);
    tableData.orderHistory = [];
    tableData.totalPrice = 0;
  }

  removeItem(table, orderIdx, itemIdx) {
    const tableData = this.tables.get(table);
    const order = tableData.orderHistory[orderIdx];

    const priceReduction = order.ticket[itemIdx].price;
    tableData.totalPrice -= priceReduction;

    const filteredTicket = order.ticket.filter((ticket, pos) => pos != itemIdx);
    if (filteredTicket.length == 0) {
      // Removes the empty ticket order from the order history
      const filteredOrder = tableData.orderHistory.filter(
        (orders, idx) => idx != orderIdx
      );
      tableData.orderHistory = filteredOrder;
    } else {
      order.ticket = filteredTicket;
    }
  }

  getPrice(table) {
    const tableData = this.tables.get(table);
    return tableData.totalPrice;
  }

  getKitchenTicket() {
    return this.kitchenTicket;
  }

  removeKitchenTicket(id) {
    this.kitchenTicket = this.kitchenTicket.filter(
      (data) => data.orderID != id
    );
  }

  addTakeoutTicket(ticket) {
    const dateCreated = new Date().getTime();
    const updatedTicket = {
      dateCreated: dateCreated,
      orderID: this.orderID,
      ticket: ticket,
    };
    this.orderID++;

    this.kitchenTicket.push(updatedTicket);
    this.takeoutTicket.push(updatedTicket);
  }

  getTakeoutTicket() {
    return this.takeoutTicket;
  }

  removeTakeoutTicket(id) {
    this.takeoutTicket = this.takeoutTicket.filter(
      (data) => data.orderID !== id
    );
  }
}

const ticketManager = new TicketManager();

module.exports = { ticketManager };
