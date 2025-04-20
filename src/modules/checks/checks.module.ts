import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksController } from './checks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Check, CheckSchema } from './schemas/check.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Check.name, schema: CheckSchema},
      {name: Client.name, schema: ClientSchema}
    ]),
  ],
  controllers: [ChecksController],
  providers: [ChecksService],
  exports: [ChecksService]
})
export class ChecksModule {}
