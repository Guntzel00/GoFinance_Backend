import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const incomeArray: Array<number> = [];
    const outcomeArray: Array<number> = [];

    if (transactions.length > 0) {
      transactions.forEach((transaction): void => {
        const { type, value } = transaction;

        if (type === 'income') {
          incomeArray.push(value);
        } else {
          outcomeArray.push(value);
        }
      });

      console.log(incomeArray);
      console.log(outcomeArray);
    }

    // const test = incomeArray.reduce(
    //   (currentValue: number, previousValue: number) => {
    //     return currentValue + previousValue;
    //   },
    // );

    const income: number = incomeArray.reduce(
      (accumulator: number, currentValue: number): number => {
        console.log(accumulator, currentValue);
        return accumulator + currentValue;
      },
      0,
    );
    const outcome: number = outcomeArray.reduce(
      (accumulator: number, currentValue: number): number => {
        return accumulator + currentValue;
      },
      0,
    );
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
