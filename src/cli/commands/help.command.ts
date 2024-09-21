import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bold.blue("Программа для подготовки данных для REST API сервера.")}
        ${chalk.cyan("Примеры:")}
            ${chalk.green("cli.js --<command> [--arguments]")}
        ${chalk.cyan("Команды:")}
            ${chalk.green("--version")}:                    ${chalk.gray("# выводит номер версии (показывает текущую версию проекта)")}
            ${chalk.green("--help")}:                       ${chalk.gray("# печатает этот текст (выводит подсказку со списком всех команд)")}
            ${chalk.green("--import")} <path>:              ${chalk.gray("# импортирует данные из TSV (по пути path парсит данные из файла tsv для моковых данных)")}
            ${chalk.green("--generate")} <n> <path> <url>:  ${chalk.gray("# генерирует произвольное количество тестовых данных")}
    `);
  }
}