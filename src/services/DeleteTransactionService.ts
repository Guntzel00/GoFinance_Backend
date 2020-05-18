import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const checkIftrasactionExists = await transactionsRepository.findOne({
      where: {
        id,
      },
    });

    if (checkIftrasactionExists) {
      await transactionsRepository.remove(checkIftrasactionExists);
    } else {
      throw new AppError('No transactions with such ID');
    }
  }
}

export default DeleteTransactionService;
