import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountingAccountsService } from './accounting-accounts.service';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { UpdateAccountingAccountDto } from './dto/update-accounting-account.dto';
import { AccountingAccount } from './entities/accounting-account.entity';

@Controller('accounting-accounts')
@ApiTags('Cuentas Contables')
export class AccountingAccountsController {
  constructor(
    private readonly accountingAccountsService: AccountingAccountsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta contable' })
  @ApiBody({ type: CreateAccountingAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Cuenta contable creada exitosamente',
    type: AccountingAccount,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la creación',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una cuenta contable con ese código',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAccountingAccountDto: CreateAccountingAccountDto,
  ): Promise<AccountingAccount> {
    return await this.accountingAccountsService.create(
      createAccountingAccountDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cuentas contables' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas contables obtenida exitosamente',
    type: [AccountingAccount],
  })
  @ApiResponse({
    status: 400,
    description: 'Error obteniendo cuentas contables',
  })
  async findAll(): Promise<AccountingAccount[]> {
    return await this.accountingAccountsService.findAll();
  }

  @Get('by-code')
  @ApiOperation({ summary: 'Buscar cuenta contable por código' })
  @ApiQuery({
    name: 'code',
    description: 'Código de la cuenta contable a buscar',
    example: '101-001-001-001-01',
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable encontrada o null si no existe',
    type: AccountingAccount,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la búsqueda',
  })
  async findByCode(
    @Query('code') code: string,
  ): Promise<AccountingAccount | null> {
    return await this.accountingAccountsService.findByCode(code);
  }

  @Get('by-pattern')
  @ApiOperation({ summary: 'Buscar cuentas contables por patrón en el código' })
  @ApiQuery({
    name: 'pattern',
    description: 'Patrón a buscar en el código de cuenta',
    example: '101-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Cuentas contables encontradas con el patrón',
    type: [AccountingAccount],
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la búsqueda',
  })
  async findByPattern(
    @Query('pattern') pattern: string,
  ): Promise<AccountingAccount[]> {
    return await this.accountingAccountsService.findByCodePattern(pattern);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cuenta contable por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cuenta contable',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable encontrada exitosamente',
    type: AccountingAccount,
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta contable no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AccountingAccount> {
    return await this.accountingAccountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cuenta contable' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cuenta contable a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateAccountingAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable actualizada exitosamente',
    type: AccountingAccount,
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta contable no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una cuenta contable con ese código',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o error en la actualización',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountingAccountDto: UpdateAccountingAccountDto,
  ): Promise<AccountingAccount> {
    return await this.accountingAccountsService.update(
      id,
      updateAccountingAccountDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cuenta contable' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cuenta contable a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta contable eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedAccount: { $ref: '#/components/schemas/AccountingAccount' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta contable no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar porque tiene movimientos asociados',
  })
  @ApiResponse({
    status: 400,
    description: 'Error eliminando cuenta contable',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; deletedAccount: AccountingAccount }> {
    return await this.accountingAccountsService.remove(id);
  }
}
