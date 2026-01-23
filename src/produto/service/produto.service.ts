import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({ relations: ['categoria'] });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');

    return produto;
  }

  create(produto: Produto): Promise<Produto> {
    return this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);
    return this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.produtoRepository.delete(id);
  }
}
