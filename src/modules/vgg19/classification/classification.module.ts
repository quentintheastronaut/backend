import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ClassificationController],
  providers: [ClassificationService],
})
export class ClassificationModule {}
