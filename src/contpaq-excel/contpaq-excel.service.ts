import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { CreateContpaqExcelDto } from './dto/create-contpaq-excel.dto';
import { UpdateContpaqExcelDto } from './dto/update-contpaq-excel.dto';

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

  create(createContpaqExcelDto: CreateContpaqExcelDto) {
    return 'This action adds a new contpaqExcel';
  }

  findAll() {
    return `This action returns all contpaqExcel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contpaqExcel`;
  }

  update(id: number, updateContpaqExcelDto: UpdateContpaqExcelDto) {
    return `This action updates a #${id} contpaqExcel`;
  }

  remove(id: number) {
    return `This action removes a #${id} contpaqExcel`;
  }
}
