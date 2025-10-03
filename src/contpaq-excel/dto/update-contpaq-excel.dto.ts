import { PartialType } from '@nestjs/swagger';
import { CreateContpaqExcelDto } from './create-contpaq-excel.dto';

export class UpdateContpaqExcelDto extends PartialType(CreateContpaqExcelDto) {}
