import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema.js';
import { RolesService } from './roles.service.js';

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
