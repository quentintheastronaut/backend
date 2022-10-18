import { DabizService } from './dabiz.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule], // imported axios/HttpModule
  controllers: [],
  providers: [DabizService],
})
export class ApiModule {}
