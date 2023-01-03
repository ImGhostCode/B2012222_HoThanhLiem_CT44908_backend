module.exports = {
  create: (req, res) => {
    res.send({ message: "create handler" });
  },
  findAll: (req, res) => {
    res.send({ message: "findAll handler" });
  },
  findOne: (req, res) => {
    res.send({ message: "findOne handler" });
  },
  update: (req, res) => {
    res.send({ message: "update handler" });
  },
  delete: (req, res) => {
    res.send({ message: "delete handler" });
  },
  deleteAll: (req, res) => {
    res.send({ message: "deleteAll handler" });
  },
  findAllFavorite: (req, res) => {
    res.send({ message: "findAllFavorite handler" });
  },
};
