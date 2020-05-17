import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();

    if (balance.total < value && type === 'outcome') {
      throw new AppError(
        'Insufficient balance on account, transaction not completed',
      );
    }

    let checkCategoryExists = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!checkCategoryExists) {
      const newCategory = categoriesRepository.create({
        title,
      });

      checkCategoryExists = newCategory;

      await categoriesRepository.save(newCategory);
    }

    // const category = await categoriesRepository.findOne({
    //   where: { title: categoryTitle },
    // });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
