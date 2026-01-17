class TicketManager {
  constructor() {
    this.tables = new Map();
    this.kitchenTicket = [];
    this.takeoutTicket = [];
    this.completedOrders = [];
    this.orderID = 1;
  }

  initialize(arr) {
    this.tables = new Map(
      arr.map((data) => [
        data,
        {
          status: "empty",
          dateCreated: null,
          ticket: [],
          totalPrice: 0,
        },
      ])
    );
  }

  getTicket(tableName) {
    const table = this.tables.get(tableName);
    return table.ticket;
  }

  getPrice(tableName) {
    const table = this.tables.get(tableName);
    return table.totalPrice;
  }

  getKitchenTicket() {
    return this.kitchenTicket;
  }

  getTakeoutTicket() {
    return this.takeoutTicket;
  }

  getCompletedOrders() {
    return this.completedOrders;
  }

  addTicket(tableName, ticket, totalPrice) {
    const table = this.tables.get(tableName);

    if (table.status == "empty") {
      table.status = "occupied";
      table.dateCreated = new Date().getTime();
    }

    table.ticket.push(...ticket);
    table.totalPrice += totalPrice;

    this.kitchenTicket.push({
      dateCreated: new Date().getTime(),
      orderID: this.orderID,
      ticket: ticket,
    });
    this.orderID++;
  }

  addTakeoutTicket(ticket, name, phoneNumber) {
    const updatedTicket = {
      dateCreated: new Date().getTime(),
      orderID: this.orderID,
      ticket: ticket,
      name: name,
      phoneNumber: phoneNumber,
    };
    this.orderID++;

    this.kitchenTicket.push(updatedTicket);
    this.takeoutTicket.push(updatedTicket);
  }

  handlePayment(tableName) {
    const table = this.tables.get(tableName);
    this.completedOrders.push({
      dateCreated: table.dateCreated,
      ticket: table.ticket,
      totalPrice: table.totalPrice,
    });
    table.status = "empty";
    table.dateCreated = null;
    table.ticket = [];
    table.totalPrice = 0;
  }

  removeItem(tableName, itemIdx) {
    const table = this.tables.get(tableName);

    const priceReduction = table.ticket[itemIdx].price;
    table.totalPrice -= priceReduction;

    const filteredTicket = table.ticket.filter((ticket, idx) => idx != itemIdx);
    table.ticket = filteredTicket;
  }

  removeKitchenTicket(id) {
    this.kitchenTicket = this.kitchenTicket.filter(
      (data) => data.orderID != id
    );
  }

  removeTakeoutTicket(id) {
    this.takeoutTicket = this.takeoutTicket.filter(
      (data) => data.orderID !== id
    );
  }
}

const ticketManager = new TicketManager();

module.exports = { ticketManager };
