import { Controller, Get, Param, Request } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Get()
  @Roles(Role.USER)
  getAllCheck(@Request() req: any) {
    return this.checksService.getAllCheckByUser(req.user._id);
  }

  @Get(':id')
  @Roles(Role.USER)
  getCheckById(@Param('id') id:string, @Request() req:any) {
    return this.checksService.getById(id, req.user._id);
  }
}
