import sigilium from 'sigilium';
import { get, set } from 'idb-keyval';

const conversation = sigilium.composite('conversation');
const user = sigilium.composite('user');
const assistant = sigilium.composite('assistant');

class ConversationManager {
  constructor(user, assistant, turns = []) {
    this.user = user;
    this.assistant = assistant;
    this.turns = turns;
  }

  async advance() {
    const userMessage = await this.user.message();
    const assistantReply = await this.assistant.reply(userMessage);
    this.turns.push({ message: userMessage, reply: assistantReply });
    await set('conversation', this);
    return this.turns[this.turns.length - 1];
  }

  static async load() {
    const conversation = await get('conversation');
    if (conversation) {
      return conversation;
    } else {
      return new ConversationManager(
        await conversation.user.message(),
        await conversation.assistant.reply('')
      );
    }
  }
}

const conversations = () => ({
  install: [
    user.resolver(),
    assistant.resolver(),
    conversation.resolver(),
    conversation.provider([
      user.resolve,
      assistant.resolve
    ], ([user], [assistant]) =>
      (turns) => new ConversationManager(user, assistant, turns)
    ),
    conversation.aggregator([], () => (impls) => impls[0])
  ]
});

conversations.conversation = conversation;
conversations.user = user;
conversations.assistant = assistant;

export default conversations;