import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';
import { AccountingAccount } from './entities/accounting-account.entity';

@Injectable()
export class AccountingAccountsService {
  constructor(
    @InjectRepository(AccountingAccount)
    private readonly accountingAccountRepository: Repository<AccountingAccount>,
  ) {}

  /**
   * Crear una nueva cuenta contable
   */
  async create(
    createAccountingAccountDto: CreateAccountingAccountDto,
  ): Promise<AccountingAccount> {
    try {
      // Verificar que el código no exista
      const existingAccount = await this.accountingAccountRepository.findOne({
        where: { accountCode: createAccountingAccountDto.accountCode },
      });

      if (existingAccount) {
        throw new ConflictException(
          `Ya existe una cuenta contable con código "${createAccountingAccountDto.accountCode}"`,
        );
      }

      const account = this.accountingAccountRepository.create(
        createAccountingAccountDto,
      );
      const savedAccount = await this.accountingAccountRepository.save(account);

      console.log('Cuenta contable creada:', savedAccount);
      return savedAccount;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      console.error('Error creando cuenta contable:', error);
      throw new BadRequestException(
        `Error creando cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener todas las cuentas contables
   */
  async findAll(): Promise<AccountingAccount[]> {
    try {
      const accounts = await this.accountingAccountRepository.find({
        order: { accountCode: 'ASC' },
      });

      console.log(`Encontradas ${accounts.length} cuentas contables`);
      return accounts;
    } catch (error) {
      console.error('Error obteniendo cuentas contables:', error);
      throw new BadRequestException(
        `Error obteniendo cuentas contables: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Obtener una cuenta contable por ID
   */
  async findOne(id: number): Promise<AccountingAccount> {
    try {
      const account = await this.accountingAccountRepository.findOne({
        where: { accountingAccountId: id },
        relations: ['movements'],
      });

      if (!account) {
        throw new NotFoundException(
          `Cuenta contable con ID ${id} no encontrada`,
        );
      }

      console.log('Cuenta contable encontrada:', account);
      return account;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error obteniendo cuenta contable:', error);
      throw new BadRequestException(
        `Error obteniendo cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Actualizar una cuenta contable
   */
  async update(
    id: number,
    updateAccountingAccountDto: UpdateAccountingAccountDto,
  ): Promise<AccountingAccount> {
    try {
      // Verificar que la cuenta existe
      const existingAccount = await this.findOne(id);

      // Si se actualiza el código, verificar que no exista otra con el mismo código
      if (
        updateAccountingAccountDto.accountCode &&
        updateAccountingAccountDto.accountCode !== existingAccount.accountCode
      ) {
        const duplicateAccount = await this.accountingAccountRepository.findOne(
          {
            where: { accountCode: updateAccountingAccountDto.accountCode },
          },
        );

        if (duplicateAccount) {
          throw new ConflictException(
            `Ya existe una cuenta contable con código "${updateAccountingAccountDto.accountCode}"`,
          );
        }
      }

      // Actualizar la cuenta
      await this.accountingAccountRepository.update(
        id,
        updateAccountingAccountDto,
      );

      // Retornar la cuenta actualizada
      const updatedAccount = await this.findOne(id);

      console.log('Cuenta contable actualizada:', updatedAccount);
      return updatedAccount;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Error actualizando cuenta contable:', error);
      throw new BadRequestException(
        `Error actualizando cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Eliminar una cuenta contable
   */
  async remove(
    id: number,
  ): Promise<{ message: string; deletedAccount: AccountingAccount }> {
    try {
      // Verificar que la cuenta existe
      const existingAccount = await this.findOne(id);

      // Verificar que no tenga movimientos asociados
      if (existingAccount.movements && existingAccount.movements.length > 0) {
        throw new ConflictException(
          `No se puede eliminar la cuenta contable porque tiene ${existingAccount.movements.length} movimiento(s) asociado(s)`,
        );
      }

      // Eliminar la cuenta
      await this.accountingAccountRepository.delete(id);

      console.log(`Cuenta contable con ID ${id} eliminada`);
      return {
        message: `Cuenta contable con ID ${id} eliminada exitosamente`,
        deletedAccount: existingAccount,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Error eliminando cuenta contable:', error);
      throw new BadRequestException(
        `Error eliminando cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar cuenta contable por código
   */
  async findByCode(accountCode: string): Promise<AccountingAccount | null> {
    try {
      const account = await this.accountingAccountRepository.findOne({
        where: { accountCode },
      });

      console.log(
        `Cuenta contable con código "${accountCode}":`,
        account ? 'encontrada' : 'no encontrada',
      );
      return account;
    } catch (error) {
      console.error('Error buscando cuenta contable por código:', error);
      throw new BadRequestException(
        `Error buscando cuenta contable por código: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar o crear cuenta contable por código y nombre (útil para la integración con ContPAQ)
   */
  async findOrCreateByCodeAndName(
    accountCode: string,
    name?: string,
  ): Promise<AccountingAccount> {
    try {
      let account = await this.findByCode(accountCode);

      if (!account) {
        const createDto: CreateAccountingAccountDto = {
          accountCode,
          name: name || `Cuenta ${accountCode}`,
        };

        account = await this.create(createDto);
        console.log(`Cuenta contable creada automáticamente: ${accountCode}`);
      }

      return account;
    } catch (error) {
      console.error('Error en findOrCreateByCodeAndName:', error);
      throw new BadRequestException(
        `Error buscando o creando cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Buscar cuentas contables por patrón en el código
   */
  async findByCodePattern(pattern: string): Promise<AccountingAccount[]> {
    try {
      const accounts = await this.accountingAccountRepository
        .createQueryBuilder('account')
        .where('account.account_code LIKE :pattern', {
          pattern: `%${pattern}%`,
        })
        .orderBy('account.account_code', 'ASC')
        .getMany();

      console.log(
        `Encontradas ${accounts.length} cuentas contables con patrón "${pattern}"`,
      );
      return accounts;
    } catch (error) {
      console.error('Error buscando cuentas por patrón:', error);
      throw new BadRequestException(
        `Error buscando cuentas por patrón: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }
}
