const express = require("express");
const router = express.Router();
const { contactController } = require("../controllers/index.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        address:
 *          type: string
 *        phone:
 *          type: string
 *        favorite:
 *         type: boolean
 */

router
  .route("/")
  /**
   * @swagger
   * /contacts:
   *   get:
   *     tags:
   *      - contacts
   *     summary: Retrieve a list of contacts.
   *     description: Retrieve a list of contacts from JSONPlaceholder. Can be used to populate a list of fake contacts when prototyping or testing an API.
   *     parameters:
   *      - name: name
   *        in: query
   *        description: Search contact by name
   *        required: false
   *     responses:
   *       200:
   *         description: A list of contacts.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                   description: The code status.
   *                   example: 200
   *                 status:
   *                   type: string
   *                   description: The status.
   *                   example: success
   *                 message:
   *                   type: string
   *                   description: The message.
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Contact'
   */
  .get(contactController.findAll)
  /**
   * @swagger
   * /contacts:
   *   post:
   *     tags:
   *      - contacts
   *     summary: Create a contact.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Contact'
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                   required: true
   *                   description: The code status.
   *                   example: 201
   *                 status:
   *                   type: string
   *                   description: The status.
   *                   example: success
   *                 message:
   *                   type: string
   *                   description: The message.
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/Contact'
   */
  .post(contactController.create)
  /**
   * @swagger
   * /contacts:
   *   delete:
   *     tags:
   *      - contacts
   *     summary: Delete all contacts
   *     responses:
   *       200:
   *         description: Deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                   required: true
   *                   description: The code status.
   *                   example: 200
   *                 status:
   *                   type: string
   *                   description: The status.
   *                   example: success
   *                 message:
   *                   type: string
   *                   description: The message.
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Contact'
   */
  .delete(contactController.deleteAll);

/**
* @swagger
* /contacts/favorite:
*   get:
*     tags:
*      - contacts
*     summary: Retrieve a list of favorite contacts.
*     description: Retrieve a list of favorite contacts from JSONPlaceholder. Can be used to populate a list of fake contacts when prototyping or testing an API.
*     responses:
*       200:
*         description: A list of favorite contacts.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: integer
*                   description: The code status.
*                   example: 200
*                 status:
*                   type: string
*                   description: The status.
*                   example: success
*                 message:
*                   type: string
*                   description: The message.
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Contact'
*/
router.route("/favorite").get(contactController.findAllFavorite);

router
  .route("/:id")
  /**
  * @swagger
  * /contacts/{id}:
  *   get:
  *     tags: 
  *       - contacts
  *     summary: Retrieve a single contact.
  *     description: Retrieve a single contact by its ID from JSONPlaceholder.
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Numeric ID of the contact to retrieve.
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: A single contact.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: The code status.
  *                   example: 200
  *                 status:
  *                   type: string
  *                   description: The status.
  *                   example: success
  *                 message:
  *                   type: string
  *                   description: The message.
  *                 data:
  *                   type: object
  *                   $ref: '#/components/schemas/Contact'
  */
  .get(contactController.findOne)
  /**
   * @swagger
   * /contacts/{id}:
   *   put:
   *     tags:
   *       - contacts
   *     summary: Update a contact.
   *     description: Update a contact by its ID from JSONPlaceholder.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Numeric ID of the contact to retrieve.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Contact'
   *     responses:
   *       200:
   *         description: A single contact.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                   description: The code status.
   *                   example: 200
   *                 status:
   *                   type: string
   *                   description: The status.
   *                   example: success
   *                 message:
   *                   type: string
   *                   description: The message.
   *                 data:
   *                   type: object
   *                   $ref: '#/components/schemas/Contact'
  */
  .put(contactController.update)

  /**
* @swagger
* /contacts/{id}:
*   delete:
*     tags: 
*       - contacts
*     summary: Delete a single contact.
*     description: Delete a single contact by its ID from JSONPlaceholder.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: Numeric ID of the contact to delete.
*         schema:
*           type: string
*     responses:
*       200:
*         description: A single contact.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 code:
*                   type: integer
*                   description: The code status.
*                   example: 200
*                 status:
*                   type: string
*                   description: The status.
*                   example: success
*                 message:
*                   type: string
*                   description: The message.
*                 data:
*                   type: object
*                   $ref: '#/components/schemas/Contact'
*/
  .delete(contactController.delete);
module.exports = router;
