import { ClassifyImageDto } from './dto/request/classifyImage.dto';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class ClassificationService {
  async classifyImage(classifyImageDto: ClassifyImageDto) {
    const { image } = classifyImageDto;
    return image;
  }
}
