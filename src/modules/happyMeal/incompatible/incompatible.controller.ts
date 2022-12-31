import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Incompatible')
@ApiBearerAuth()
@Controller('Incompatible')
export class IncompatibleController {}
