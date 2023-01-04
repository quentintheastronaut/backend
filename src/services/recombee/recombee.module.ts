import { HttpModule, HttpService } from '@nestjs/axios';
import { RecombeeController } from './recombee.controller';
import { RecombeeService } from './recombee.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [RecombeeController],
  providers: [RecombeeService],
  exports: [RecombeeService],
})
export class RecombeeModule {}
