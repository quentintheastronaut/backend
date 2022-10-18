import { ClassificationController } from './classification.controller';
import { Module } from '@nestjs/common';
import { DabizService } from 'src/services/dabiz/dabiz.service';
import { HttpModule, HttpService } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [ClassificationController],
  providers: [DabizService],
})
export class ClassificationModule {}
