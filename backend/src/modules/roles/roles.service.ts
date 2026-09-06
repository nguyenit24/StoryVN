import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument, RoleType } from './role.schema.js';

const DEFAULT_ROLES = [
  {
    name: RoleType.USER,
    description: 'Người dùng/độc giả của hệ thống',
  },
  {
    name: RoleType.AUTHOR,
    description: 'Tác giả đăng và quản lý tác phẩm của mình',
  },
  {
    name: RoleType.MANAGER,
    description: 'Quản lý và kiểm duyệt nội dung hệ thống',
  },
  {
    name: RoleType.ADMIN,
    description: 'Quản trị viên hệ thống',
  },
];

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) { }

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
  }

  async seedRoles(): Promise<void> {
    const operations = DEFAULT_ROLES.map((role) => ({
      updateOne: {
        filter: { name: role.name },
        update: {
          $setOnInsert: { name: role.name },
          $set: { description: role.description, isActive: true },
        },
        upsert: true,
      },
    }));

    await this.roleModel.bulkWrite(operations);
    this.logger.log('Roles initialized successfully');
  }

  async findByName(name: RoleType): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).exec();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find({ isActive: true }).exec();
  }
}
