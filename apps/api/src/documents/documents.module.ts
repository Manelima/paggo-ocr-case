import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ConfigModule } from '@nestjs/config'; 

@Module({
  imports: [ConfigModule], 
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}