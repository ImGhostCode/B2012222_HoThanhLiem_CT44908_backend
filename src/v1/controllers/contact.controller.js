const ContactService = require("../services/contact.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  create: async (req, res, next) => {
    if (!req.body?.name) {
      return next(new ApiError(400, "error", "Name can not be empty", null));
    }

    try {
      const contactService = new ContactService();
      const { code, status, message, data } = await contactService.create(
        req.body
      );
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          "An error occurred while creating the contact",
          null
        )
      );
    }
  },
  findAll: async (req, res, next) => {
    try {
      const contactService = new ContactService();
      const { name } = req.query;
      if (name) {
        const { code, status, message, data } = await contactService.findByName(
          name
        );
        return res.status(code).json({ code, status, message, data });
      } else {
        const { code, status, message, data } = await contactService.find({});
        return res.status(code).json({ code, status, message, data });
      }
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          "An error occurred while retrieving the contact",
          null
        )
      );
    }
  },
  findOne: async (req, res, next) => {
    try {
      const contactService = new ContactService();
      const { code, status, message, data } = await contactService.findById(
        req.params.id
      );
      if (!data) {
        return next(new ApiError(404, "error", "Contact not found", null));
      }
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          `Error retrieving contact with id ${req.params.id}`,
          null
        )
      );
    }
  },
  update: async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(
        new ApiError(400, "error", "Data to update can not be empty", null)
      );
    }

    try {
      const contactService = new ContactService();
      const { code, status, message, data } = await contactService.update(
        req.params.id,
        req.body
      );
      if (!data) {
        return next(new ApiError(404, "error", "Contact not found", null));
      }
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          `Error updating contact with id ${req.params.id}`,
          null
        )
      );
    }
  },
  delete: async (req, res, next) => {
    try {
      const contactService = new ContactService();
      const { code, status, message, data } = await contactService.delete(
        req.params.id
      );
      if (!data) {
        return next(new ApiError(404, "error", "Contact not found", null));
      }
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          `Could not delete contact with id ${req.params.id}`,
          null
        )
      );
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      const contactService = new ContactService();
      const { code, status, message, data } = await contactService.deleteAll();
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(new ApiError(500, "error", `Could not delete contact`, null));
    }
  },
  findAllFavorite: async (req, res, next) => {
    try {
      const contactService = new ContactService();
      const { code, status, message, data } =
        await contactService.findFavorite();
      return res.status(code).json({ code, status, message, data });
    } catch (error) {
      return next(
        new ApiError(
          500,
          "error",
          "An error ocurred while retrieving favorite contacts",
          null
        )
      );
    }
  },
};
