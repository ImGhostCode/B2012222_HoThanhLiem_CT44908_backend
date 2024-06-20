const { isValidObjectId, default: mongoose } = require("mongoose");
const _Contact = require("../models/_Contact.model");
const { links } = require("express/lib/response");
const { REDIS_GET, REDIS_LRANGE, REDIS_SET, REDIS_DEL, REDIS_FLUSHDB } = require('../services/redis.service');


class ContactService {
  constructor() { }

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

    await REDIS_DEL('contacts');

    return {
      code: 201,
      status: "success",
      message: null,
      data: {
        ...result._doc,
        links: [
          {
            rel: "self",
            href: `/api/v1/contacts/${result._id}`,
            action: "GET",
          },
          {
            rel: "update",
            href: `/api/v1/contacts/${result._id}`,
            action: "PUT",
          },
          {
            rel: "delete",
            href: `/api/v1/contacts/${result._id}`,
            action: "DELETE",
          },
        ]
      },
    };
  }

  async find(filter) {
    let cursor;
    const cachedContacts = await REDIS_GET('contacts');
    if (cachedContacts) {
      cursor = JSON.parse(cachedContacts);
    } else {
      cursor = await _Contact.find(filter);
      await REDIS_SET('contacts', JSON.stringify(cursor));
    }
    return {
      code: 200,
      status: "success",
      message: null,
      data: {
        contacts: cursor.map((contact) => ({
          ...contact._doc ? contact._doc : contact,
          links: [
            {
              rel: "self",
              href: `/api/v1/contacts/${contact._id}`,
              action: "GET",
            },
            {
              rel: "update",
              href: `/api/v1/contacts/${contact._id}`,
              action: "PUT",
            },
            {
              rel: "delete",
              href: `/api/v1/contacts/${contact._id}`,
              action: "DELETE",
            },
          ],
        })),
        links: [
          {
            rel: "self",
            href: `/api/v1/contacts`,
            action: "GET",
          },
          {
            rel: "create",
            href: `/api/v1/contacts`,
            action: "POST",
          },
        ]
      },
    };
  }

  async findByName(name) {
    const cursor = await _Contact.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
    return {
      code: 200,
      status: "success",
      message: null,
      data: {
        contacts: [...cursor.map((contact) => ({
          ...contact._doc,
          links: [
            {
              rel: "self",
              href: `/api/v1/contacts/${contact._id}`,
              action: "GET",
            },
            {
              rel: "update",
              href: `/api/v1/contacts/${contact._id}`,
              action: "PUT",
            },
            {
              rel: "delete",
              href: `/api/v1/contacts/${contact._id}`,
              action: "DELETE",
            },
          ],
        }))], links: [
          {
            rel: "self",
            href: `/api/v1/contacts`,
            action: "GET",
          },
          {
            rel: "create",
            href: `/api/v1/contacts`,
            action: "POST",
          },
        ]
      },
    };
  }

  async findById(id) {
    let result
    const cachedContact = await REDIS_GET(id + '_contact');
    if (cachedContact) {
      result = JSON.parse(cachedContact);
    } else {
      result = await _Contact.findOne({
        _id: isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null,
      });
      await REDIS_SET(id + '_contact', JSON.stringify(result));
    }
    return {
      code: 200,
      status: "success",
      message: null,
      data: {
        ...result._doc ? result._doc : result, links: [
          {
            rel: "self",
            href: `/api/v1/contacts/${result._id}`,
            action: "GET",
          },
          {
            rel: "update",
            href: `/api/v1/contacts/${result._id}`,
            action: "PUT",
          },
          {
            rel: "delete",
            href: `/api/v1/contacts/${result._id}`,
            action: "DELETE",
          },
        ]
      },
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

    await REDIS_FLUSHDB();

    return {
      code: 200,
      status: "success",
      message: "Contact was updated successfully",
      data: {
        ...result._doc, links: [
          {
            rel: "self",
            href: `/api/v1/contacts/${result._id}`,
            action: "GET",
          },
          {
            rel: "update",
            href: `/api/v1/contacts/${result._id}`,
            action: "PUT",
          },
          {
            rel: "delete",
            href: `/api/v1/contacts/${result._id}`,
            action: "DELETE",
          },
        ]
      },
    };
  }

  async delete(id) {
    const result = await _Contact.findOneAndDelete({
      _id: isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null,
    });

    await REDIS_DEL('contacts');

    return {
      code: 200,
      status: "success",
      message: "Contact was deleted successfully",
      data: {
        ...result._doc, links: [
        ]
      },
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
    await REDIS_DEL('contacts');
    return {
      code: 200,
      status: "success",
      message: `${result.deletedCount} contacts were deleted successfully`,
      data: {
        contacts: result, links: [
          {
            rel: "self",
            href: `/api/v1/contacts`,
            action: "GET",
          },
          {
            rel: "create",
            href: `/api/v1/contacts`,
            action: "POST",
          },
        ]
      },
    };
  }
}

module.exports = ContactService;
