import { ClassifyImageDto } from './dto/request/classifyImage.dto';
import { ClassificationService } from './classification.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('classification')
export class ClassificationController {
  constructor(private classificationService: ClassificationService) {}

  @Post()
  async classifyImage(@Body() classifyImageDto: ClassifyImageDto) {
    return this.classificationService.classifyImage(classifyImageDto);
  }
}
