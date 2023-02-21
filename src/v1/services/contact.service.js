const { isValidObjectId, default: mongoose } = require("mongoose");
const _Contact = require("../models/_Contact.model");

class ContactService {
  constructor() {}

  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );
    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await _Contact.findOneAndUpdate(
      contact,
      {
        $set: { favorite: contact.favorite === true },
      },
      { returnDocument: "after", upsert: true }
    );

    return {
      code: 201,
      status: "success",
      message: null,
      data: result,
    };
  }

  async find(filter) {
    const cursor = await _Contact.find(filter);
    return {
      code: 200,
      status: "success",
      message: null,
      data: cursor,
    };
  }

  async findByName(name) {
    const result = await _Contact.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
    return {
      code: 200,
      status: "success",
      message: null,
      data: result,
    };
  }

  async findById(id) {
    const result = await _Contact.findOne({
      _id: isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null,
    });
    return {
      code: 200,
      status: "success",
      message: null,
      data: result,
    };
  }

  async update(id, payload) {
    const filter = {
      _id: isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await _Contact.findOneAndUpdate(filter, update, {
      new: true,
    });

    return {
      code: 200,
      status: "success",
      message: "Contact was updated successfully",
      data: result,
    };
  }

  async delete(id) {
    const result = await _Contact.findOneAndDelete({
      _id: isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null,
    });
    return {
      code: 200,
      status: "success",
      message: "Contact was deleted successfully",
      data: result,
    };
  }

  async findFavorite() {
    const { data } = await this.find({ favorite: true });
    return {
      code: 200,
      status: "success",
      message: null,
      data,
    };
  }

  async deleteAll() {
    const result = await _Contact.deleteMany({});
    return {
      code: 200,
      status: "success",
      message: `${result.deletedCount} contacts were deleted successfully`,
      data: result,
    };
  }
}

module.exports = ContactService;
