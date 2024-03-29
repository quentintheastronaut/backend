import { ClassifyImageDto } from './dto/request/classifyImage.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { DabizService } from 'src/services/dabiz/dabiz.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Image Classification')
@Controller('classification')
export class ClassificationController {
  constructor(private _dabizService: DabizService) {}

  @Post()
  async classifyImage(@Body() classifyImageDto: ClassifyImageDto) {
    return this._dabizService.classify(classifyImageDto);
  }
}
