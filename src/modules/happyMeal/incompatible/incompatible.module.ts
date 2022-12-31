import { IncompatibleService } from './incompatible.service';
import { IncompatibleController } from './incompatible.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [IncompatibleController],
  providers: [IncompatibleService],
  exports: [],
})
export class IncompatibleModule {}
