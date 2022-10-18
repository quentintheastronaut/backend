import { ClassifyImageDto } from 'src/modules/vgg19/classification/dto/request/classifyImage.dto';
import { DabizService } from 'src/services/dabiz/dabiz.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('dabiz')
export class DabizController {
  constructor(private dabizService: DabizService) {}

  @Post('/dabiz')
  async classifyImage(@Body() classifyImageDto: ClassifyImageDto) {
    return this.dabizService.classify(classifyImageDto);
  }
}
