import chalk from 'chalk';

export function log(message: string, color: string = 'redBright') {
    if (logging) {
        console.log(chalk[color](message));
    }
}

export const logging = true;