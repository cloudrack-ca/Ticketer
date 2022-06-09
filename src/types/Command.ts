import type { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import type {
	CommandInteraction,
	MessageComponentInteraction,
	ModalSubmitInteraction
} from 'discord.js';
import type { Client } from '.';

type Awaitable<T> = T | PromiseLike<T>;

interface Components {
	readonly execute: ({
		client,
		interaction
	}: {
		client: Client;
		interaction: MessageComponentInteraction;
	}) => Awaitable<void>;
	readonly customIds: string[];
}

interface Modals {
	readonly execute: ({
		client,
		interaction
	}: {
		client: Client;
		interaction: ModalSubmitInteraction;
	}) => Awaitable<void>;
	readonly customIds: string[];
}

export interface Command {
	readonly execute: ({
		client,
		interaction
	}: {
		client: Client;
		interaction: CommandInteraction;
	}) => Awaitable<void>;
	readonly data:
		| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder;
	readonly category: 'Utility' | 'Ticketing' | 'Staff' | 'Suggestions';
	readonly components?: Components;
	readonly modals?: Modals;
	readonly ownerOnly?: boolean;
	readonly privateGuildAndOwnerOnly?: boolean;
}
