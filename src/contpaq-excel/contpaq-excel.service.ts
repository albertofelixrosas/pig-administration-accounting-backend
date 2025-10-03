import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

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

// Interfaces temporales (hasta que se definan los servicios reales)
interface CreateMovementDto {
  segment_id: number;
  accounting_account_id: number;
  date: string; // ISO date string format (YYYY-MM-DD)
  number: number;
  concept: string;
  charge: number | null;
  reference: string;
  supplier: string;
}

@Injectable()
export class ContpaqExcelService {
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

        // Aquí puedes agregar la lógica específica para procesar los datos
        // Por ejemplo, guardar en base de datos, validar datos, etc.
        this.processWorksheetData(worksheet.name, rows);
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

      // 1️⃣ Buscar la razón social de la empresa
      const companyName = String(rows[1]?.[4] || '').trim();

      if (!companyName) {
        throw new BadRequestException(
          'No se encontró la razón social en el documento',
        );
      }

      console.log(`Empresa encontrada: ${companyName}`);

      // Buscar la razón social en la base de datos para obtener su id
      try {
        // TODO: Implementar cuando se tenga el servicio de empresas
        // const company = await this.companiesService.findOrCreateByCompanyName(companyName);
        const company = { company_id: 1 }; // Mock temporal

        // 2️⃣ Buscar las cuentas contables
        let currentAccountId = 0;
        let currentAccountName = '';
        let currentSegmentId = 0;

        for (let i = 1; i < rows.length; i++) {
          const currentRow = rows[i];
          const currentFirstColumn = String(rows[i]?.[1] || '').trim();

          // 3️⃣ Buscar a partir del valor de la primera columna:

          // 1. Cuenta contable
          if (currentFirstColumn.match(acountNumberRegex)) {
            const accountName = String(rows[i]?.[2] || '').trim();
            currentAccountName = accountName;
            const companyId = company.company_id;

            console.log(
              `Procesando cuenta: ${currentFirstColumn} - ${accountName}`,
            );

            // TODO: Implementar cuando se tenga el servicio de cuentas
            // const account = await this.accountsService.findOrCreateByCodeAndName(
            //   companyId,
            //   currentFirstColumn,
            //   accountName,
            // );
            // currentAccountId = account.accounting_account_id;
            currentAccountId = 1; // Mock temporal
          }

          // 2. Segmento
          if (currentFirstColumn.toLowerCase().startsWith('segmento')) {
            const segmentCode = currentFirstColumn
              .split(' ')
              .filter((_, index) => index > 0)
              .join(' ')
              .trim();

            console.log(`Procesando segmento: ${segmentCode}`);

            // TODO: Implementar cuando se tenga el servicio de segmentos
            // const segment = await this.segmentsService.findOrCreateByCode(
            //   company.company_id,
            //   segmentCode,
            // );
            // currentSegmentId = segment.segment_id;
            currentSegmentId = 1; // Mock temporal
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
              segment_id: currentSegmentId,
              accounting_account_id: currentAccountId,
              date: convertToISODate(movementDate),
              number: parseInt(movementNumber),
              concept: currentAccountName, // valor por defecto, luego cambiará por el usuario
              charge: isNaN(finalChargeValue) ? null : finalChargeValue,
              reference: movementReference,
              supplier: movementConcept,
            };

            // TODO: Implementar cuando se tenga el servicio de movimientos
            // await this.movementsService.create(dto);
            console.log('DTO creado:', dto);
          }
        }

        console.log(`Procesamiento completado para empresa: ${companyName}`);
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

  /**
   * Procesa los datos de una hoja específica
   * @param worksheetName Nombre de la hoja
   * @param rows Filas de datos
   */
  private processWorksheetData(worksheetName: string, rows: any[]): void {
    console.log(`Procesando datos de la hoja: ${worksheetName}`);
    console.log(`Total de filas con datos: ${rows.length}`);

    // Aquí puedes implementar la lógica específica según el tipo de hoja
    // Por ejemplo:
    // - Si es "Movimientos", procesar como movimientos contables
    // - Si es "Cuentas", procesar como catálogo de cuentas
    // - etc.

    rows.forEach((row, index) => {
      console.log(`Fila ${index + 1}:`, row);
      // Aquí implementarías la lógica de procesamiento específica
      // Por ejemplo: validación, transformación, guardado en BD
    });
  }
}
