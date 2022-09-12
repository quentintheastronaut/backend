import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller('')
export class AppController {
  @Get('')
  main() {
    return {
      message: 'Welcome to Happy Meal server.',
    };
  }
}
