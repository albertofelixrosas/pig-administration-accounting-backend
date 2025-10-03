import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { AccountingAccountsService } from '../accounting-accounts/accounting-accounts.service';
import { CreateMovementDto } from '../movements/dto/create-movement.dto';
import { MovementsService } from '../movements/movements.service';
import { SegmentsService } from '../segments/segments.service';

// Expresiones regulares para validaciones
const acountNumberRegex = /^\d{3}-\d{3}-\d{3}-\d{3}-\d{2}$/;
const excelCommonDateRegex =
  /^([0-2]?\d|3[01])\/(Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic)\/\d{4}\s?$/;

// Función helper para convertir fecha
function convertToISODate(date: string): string {
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  const parts = date.split('/');
  const [day, monthString, year] = parts;

  // Example: 2025-07-31
  const month = `${months.indexOf(monthString) + 1}`;
  const result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return result;
}

@Injectable()
export class ContpaqExcelService {
  constructor(
    private readonly movementsService: MovementsService,
    private readonly accountingAccountsService: AccountingAccountsService,
    private readonly segmentsService: SegmentsService,
  ) {}
  /**
   * Procesa un archivo Excel de ContPAQ y extrae los datos
   * @param filePath Ruta del archivo Excel a procesar
   * @returns Objeto con información de procesamiento
   */
  async processExcelFile(
    filePath: string,
  ): Promise<{ recordsProcessed: number }> {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      console.log(`Procesando archivo: ${filePath}`);

      // Crear un workbook de ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      let totalRecords = 0;

      // Iterar sobre todas las hojas del archivo
      workbook.worksheets.forEach((worksheet, index) => {
        console.log(`Procesando hoja ${index + 1}: "${worksheet.name}"`);

        // Obtener datos de la hoja (excluyendo la primera fila si es encabezado)
        const rows: any[] = [];

        worksheet.eachRow((row, rowNumber) => {
          // Saltar la primera fila si contiene encabezados
          if (rowNumber === 1) {
            console.log('Encabezados encontrados:', row.values);
            return;
          }

          // Convertir la fila a array de valores
          const rowData = row.values as any[];

          // Filtrar valores vacíos o null
          const cleanRowData = rowData
            .slice(1)
            .filter(
              (cell) => cell !== null && cell !== undefined && cell !== '',
            );

          if (cleanRowData.length > 0) {
            rows.push(cleanRowData);
            totalRecords++;
          }
        });

        console.log(
          `Registros procesados en hoja "${worksheet.name}": ${rows.length}`,
        );
      });

      // Eliminar el archivo temporal después del procesamiento
      fs.unlinkSync(filePath);
      console.log(`Archivo temporal eliminado: ${filePath}`);

      return {
        recordsProcessed: totalRecords,
      };
    } catch (error) {
      console.error('Error procesando archivo Excel:', error);

      // Intentar eliminar el archivo temporal en caso de error
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error eliminando archivo temporal:', cleanupError);
      }

      throw new BadRequestException(
        `Error procesando archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }

  /**
   * Carga y procesa todos los datos de movimientos desde un archivo Excel de ContPAQ
   * @param filePath Ruta del archivo Excel a procesar
   */
  async loadAllMovementDataByFilename(filePath: string): Promise<void> {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      console.log(`Cargando datos de movimientos desde: ${filePath}`);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const sheet = workbook.worksheets[0];

      const rows = sheet.getSheetValues(); // matriz [fila][columna]

      // 1️⃣ Verificar que hay datos en el archivo
      if (!rows || rows.length < 2) {
        throw new BadRequestException(
          'El archivo no contiene suficientes datos para procesar',
        );
      }

      console.log(`Procesando archivo Excel con ${rows.length} filas`);

      // Variables para mantener el estado actual durante el procesamiento
      let currentAccountId = 0;
      let currentAccountName = '';
      let currentSegmentId = 0;

      try {
        for (let i = 1; i < rows.length; i++) {
          const currentRow = rows[i];
          const currentFirstColumn = String(rows[i]?.[1] || '').trim();

          // 3️⃣ Buscar a partir del valor de la primera columna:

          // 1. Cuenta contable
          if (currentFirstColumn.match(acountNumberRegex)) {
            const accountName = String(rows[i]?.[2] || '').trim();
            currentAccountName = accountName;

            console.log(
              `Procesando cuenta: ${currentFirstColumn} - ${accountName}`,
            );

            // Buscar o crear la cuenta contable
            try {
              const account =
                await this.accountingAccountsService.findOrCreateByCodeAndName(
                  currentFirstColumn,
                  accountName,
                );
              currentAccountId = account.accountingAccountId;
              console.log(
                `Cuenta contable encontrada/creada con ID: ${currentAccountId}`,
              );
            } catch (error) {
              console.error(
                `Error procesando cuenta ${currentFirstColumn}:`,
                error,
              );
              throw new BadRequestException(
                `Error procesando cuenta contable: ${currentFirstColumn}`,
              );
            }
          }

          // 2. Segmento
          if (currentFirstColumn.toLowerCase().startsWith('segmento')) {
            const segmentCode = currentFirstColumn
              .split(' ')
              .filter((_, index) => index > 0)
              .join(' ')
              .trim();

            console.log(`Procesando segmento: ${segmentCode}`);

            // Buscar o crear el segmento
            try {
              const segment = await this.segmentsService.findOrCreateByCode(
                segmentCode,
                `Segmento ${segmentCode}`,
              );
              currentSegmentId = segment.segmentId;
              console.log(
                `Segmento encontrado/creado con ID: ${currentSegmentId}`,
              );
            } catch (error) {
              console.error(`Error procesando segmento ${segmentCode}:`, error);
              throw new BadRequestException(
                `Error procesando segmento: ${segmentCode}`,
              );
            }
          }

          // 3. Movimiento
          if (currentFirstColumn.match(excelCommonDateRegex)) {
            const movementDate = String(currentRow?.[1] || '');
            // const movementType = String(currentRow?.[2] || ''); // El tipo del movimiento -> "Diario" o "Egresos"
            const movementNumber = String(currentRow?.[3] || '');
            const movementConcept = String(currentRow?.[4] || ''); // Aquí es en realidad el proveedor
            const movementReference = String(currentRow?.[5] || '');
            const movementCharge = String(currentRow?.[6] || '');
            const finalChargeValue = parseFloat(movementCharge);

            console.log(
              `Procesando movimiento: ${movementDate} - ${movementConcept}`,
            );

            const dto: CreateMovementDto = {
              segmentId: currentSegmentId,
              accountingAccountId: currentAccountId,
              date: convertToISODate(movementDate),
              type: 'Egresos', // Por defecto, se puede ajustar según la lógica de negocio
              number: parseInt(movementNumber),
              concept: currentAccountName, // valor por defecto, luego cambiará por el usuario
              charge: isNaN(finalChargeValue) ? null : finalChargeValue,
              reference: movementReference,
              supplier: movementConcept,
            };

            // Crear el movimiento en la base de datos
            const createdMovement = await this.movementsService.create(dto);
            console.log('Movimiento creado:', createdMovement);
          }
        }

        console.log('Procesamiento de movimientos completado exitosamente');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error procesando movimientos:', error.message);
          throw error;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error cargando datos de movimientos:', error);

      throw new BadRequestException(
        `Error cargando datos de movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      );
    }
  }
}
