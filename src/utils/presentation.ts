import chalk from 'chalk';

export const presentation = () => {
    console.log('');
    console.log(` ${chalk.blue.bold('🚀🤖🌟  Welcome to Binance Bot!  🌟🤖🚀')} ${ chalk.hex('#f0b909').bold(`v${process.env.npm_package_version}`) }`);
    console.log(chalk.grey(' Hi! I can help you to calculate helpful metrics'));
    console.log(chalk.grey(' for any cryptoasset in fiat money, right here in your console.'));
    console.log('');
}
