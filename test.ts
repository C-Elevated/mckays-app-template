import { createUserAction, getUserByUserIdAction } from "@/actions/db/users-actions"
import { createConversationAction, getConversationAction } from "@/actions/db/conversations-actions"
import { createMessageAction, getConversationMessagesAction } from "@/actions/db/messages-actions"
import { randomUUID } from "crypto"

async function test() {
  // Create a test user with proper UUID
  const userResult = await createUserAction({
    id: randomUUID(),
    membership: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null
  })
  console.log("Create user result:", userResult)

  if (!userResult.isSuccess) {
    console.error("Failed to create user")
    return
  }

  // Create a conversation for this user
  const conversationResult = await createConversationAction({
    userId: userResult.data.id
  })
  console.log("Create conversation result:", conversationResult)

  if (!conversationResult.isSuccess) {
    console.error("Failed to create conversation")
    return
  }

  // Create a message in this conversation
  const messageResult = await createMessageAction({
    conversationId: conversationResult.data.id,
    senderId: userResult.data.id,
    role: "user",
    content: "Hello, this is a test message!"
  })
  console.log("Create message result:", messageResult)

  // Verify we can fetch everything back
  const fetchUserResult = await getUserByUserIdAction(userResult.data.id)
  console.log("Fetch user result:", fetchUserResult)

  const fetchConversationResult = await getConversationAction(conversationResult.data.id)
  console.log("Fetch conversation result:", fetchConversationResult)

  const fetchMessagesResult = await getConversationMessagesAction(conversationResult.data.id)
  console.log("Fetch messages result:", fetchMessagesResult)
}

test().catch(console.error)
