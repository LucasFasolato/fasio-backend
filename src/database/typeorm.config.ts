import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  const isDevelopment = configService.get<string>('nodeEnv') === 'development';

  return {
    type: 'postgres',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    autoLoadEntities: true,
    synchronize: isDevelopment,
    logging: isDevelopment,
  };
}
