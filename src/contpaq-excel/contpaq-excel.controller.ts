import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ContpaqExcelService } from './contpaq-excel.service';
import { CreateContpaqExcelDto } from './dto/create-contpaq-excel.dto';
import { UpdateContpaqExcelDto } from './dto/update-contpaq-excel.dto';

@Controller('contpaq-excel')
@ApiTags('ContPAQ Excel')
export class ContpaqExcelController {
  constructor(private readonly contpaqExcelService: ContpaqExcelService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const originalName = file.originalname;
          return cb(null, `${timestamp}-${originalName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo Excel de ContPAQ a procesar (.xlsx, .xls)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo Excel con datos de ContPAQ',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo procesado correctamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        filename: { type: 'string' },
        recordsProcessed: { type: 'number' },
        statusCode: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Tipo de archivo inválido o datos incorrectos',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async uploadExcelFile(@UploadedFile() file: Express.Multer.File) {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    try {
      console.log('Archivo recibido:', {
        filename: file?.filename,
        originalname: file?.originalname,
        mimetype: file?.mimetype,
        size: file?.size,
        path: file?.path,
      });

      if (!file || !allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Tipo de archivo inválido. Solo se permiten archivos Excel (.xlsx, .xls)',
        );
      }

      // Procesar el archivo Excel
      const result = await this.contpaqExcelService.processExcelFile(file.path);

      return {
        message: '¡Archivo Excel procesado correctamente!',
        filename: file.filename,
        recordsProcessed: result.recordsProcessed,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error procesando archivo Excel:', error);

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Error desconocido al procesar el archivo',
      );
    }
  }

  @Post()
  create(@Body() createContpaqExcelDto: CreateContpaqExcelDto) {
    return this.contpaqExcelService.create(createContpaqExcelDto);
  }

  @Get()
  findAll() {
    return this.contpaqExcelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contpaqExcelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContpaqExcelDto: UpdateContpaqExcelDto,
  ) {
    return this.contpaqExcelService.update(+id, updateContpaqExcelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contpaqExcelService.remove(+id);
  }
}
