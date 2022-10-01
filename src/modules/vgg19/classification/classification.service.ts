import { ClassifyImageDto } from './dto/request/classifyImage.dto';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class ClassificationService {
  classifyImage(classifyImageDto: ClassifyImageDto) {
    const { imageUrl } = classifyImageDto;
    console.log(imageUrl);
    return imageUrl;
  }
}
