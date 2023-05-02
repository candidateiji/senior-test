import chalk from "chalk";

export const logFailure = (_: string) => {
  console.log(chalk.red(_));
  process.exit(1);
};

export const logSuccess = (_: string) => {
  console.log(chalk.green(_));
  process.exit(0);
};
