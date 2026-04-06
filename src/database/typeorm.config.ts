import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  const isDevelopment = configService.get<string>('nodeEnv') === 'development';

  return {
    type: 'postgres',
    url: configService.get<string>('database.url'),
    autoLoadEntities: true,
    synchronize: isDevelopment,
    logging: isDevelopment,
  };
}
