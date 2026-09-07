import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema.js';
import { RolesService } from './services/roles.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [RolesService],
  exports: [MongooseModule, RolesService],
})
export class RolesModule {}
