import { WeightRecordService } from './weightRecord.service';
import { WeightRecordController } from './weightRecord.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [WeightRecordController],
  providers: [WeightRecordService],
})
export class WeightRecordModule {}
