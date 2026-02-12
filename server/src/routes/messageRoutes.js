import { Router } from "express";
import messageController from "../controllers/messageController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validation.js";
import { sendMessageSchema } from "../validators/messageValidator.js";

const router = Router();

router.post(
  "/:recipientId/send",
  authenticate,
  validate(sendMessageSchema),
  messageController.sendMessage
);
router.get(
  "/conversation/:otherUserId",
  authenticate,
  messageController.getConversation
);
router.get(
  "/conversations",
  authenticate,
  messageController.getUserConversations
);
router.put(
  "/:messageId/read",
  authenticate,
  messageController.markMessageAsRead
);
router.delete("/:messageId", authenticate, messageController.deleteMessage);

export default router;
