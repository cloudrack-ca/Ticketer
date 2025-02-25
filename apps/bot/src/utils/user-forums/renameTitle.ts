import type { BaseInteraction, Modal } from '@ticketer/djs-framework';
import { ChannelType, Colors } from 'discord.js';
import { automaticThreadsConfigurations, database, eq, userForumsConfigurations } from '@ticketer/database';
import { translate } from '@/i18n';

export async function renameTitle(
	this: BaseInteraction.Interaction,
	{ interaction }: Modal.Context,
	isAutomaticThreads = false,
) {
	const { channel, fields, locale, member, user } = interaction;
	const translations = translate(locale).tickets[isAutomaticThreads ? 'automaticThreads' : 'userForums'].buttons;
	const table = isAutomaticThreads ? automaticThreadsConfigurations : userForumsConfigurations;

	if (
		channel?.type !== ChannelType.PublicThread ||
		channel.parent?.type !== (isAutomaticThreads ? ChannelType.GuildText : ChannelType.GuildForum)
	) {
		return interaction.editReply({
			embeds: [
				this.userEmbedError(user)
					.setTitle(translations._errorIfNotThreadChannel.title())
					.setDescription(translations._errorIfNotThreadChannel.description()),
			],
		});
	}

	if (!channel.editable) {
		return interaction.editReply({
			embeds: [
				this.userEmbedError(user)
					.setTitle(translations.renameTitle.modal.errors.notEditable.title())
					.setDescription(translations.renameTitle.modal.errors.notEditable.description()),
			],
		});
	}

	const [row] = await database
		.select({
			managers: table.managers,
		})
		.from(table)
		.where(eq(table.channelId, channel.parent.id));

	// eslint-disable-next-line unicorn/no-await-expression-member
	const ownerId = isAutomaticThreads ? (await channel.fetchStarterMessage())?.author.id : channel.ownerId;

	if (!row || (ownerId !== user.id && !row.managers.some((id) => member.roles.resolve(id)))) {
		return interaction.editReply({
			embeds: [
				this.userEmbedError(user)
					.setTitle(translations._errorIfNotThreadAuthorOrManager.title())
					.setDescription(translations._errorIfNotThreadAuthorOrManager.description()),
			],
		});
	}

	const oldTitle = channel.name;
	const newTitle = fields.getTextInputValue('title');
	const successTranslations = translations.renameTitle.modal.success;
	const embed = this.userEmbed(user)
		.setColor(Colors.DarkGreen)
		.setTitle(successTranslations.title())
		.setDescription(successTranslations.description({ oldTitle, newTitle }));

	await channel.edit({ name: newTitle });
	await interaction.editReply({
		embeds: [embed],
	});
}
