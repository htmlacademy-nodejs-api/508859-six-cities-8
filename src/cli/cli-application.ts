import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';

export class CLIApplication {
  private commands: Record<string, Command> = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    this.commands = commandList.reduce((commandArr, command) => ({
      ...commandArr,
      [command.getName()]: command,
    }), {});
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }

    return this.commands[this.defaultCommand]!;
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);

    if (commandName) {
      const command = this.getCommand(commandName);
      const commandArguments = parsedCommand[commandName] ?? [];
      await command.execute(...commandArguments);
    }
  }
}
