import lovecraft from 'lovecraft';
import { get, set, del } from 'idb-keyval';

import persistence from './phantomaton-persistence.js';

const { expect, spy } = lovecraft;

describe('phantomaton-persistence', () => {
  beforeEach(async () => {
    await del('conversation');
  });

  it('persists and loads conversations', async () => {
    const [getConversation] = await persistence.conversation.resolve;
    const conversation = await getConversation();

    const userSpy = spy(() => 'hello');
    const assistantSpy = spy(msg => `You said: ${msg}`);

    conversation.user.message = userSpy;
    conversation.assistant.reply = assistantSpy;

    await conversation.advance();
    expect(userSpy).to.have.been.called;
    expect(assistantSpy).to.have.been.calledWith('hello');
    expect(await get('conversation')).to.deep.equal(conversation);

    const restoredConversation = await ConversationManager.load();
    expect(restoredConversation).to.deep.equal(conversation);
  });
});