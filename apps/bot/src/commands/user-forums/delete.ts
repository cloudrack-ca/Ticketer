import { Component, DeferReply } from '@ticketer/djs-framework';
import { UserForums } from '@/utils';

export class ComponentInteraction extends Component.Interaction {
	public readonly customIds = [super.customId('ticket_user_forums_thread_delete')];

	@DeferReply(true)
	public execute(context: Component.Context) {
		void UserForums.deleteTicket.call(this, context);
	}
}
