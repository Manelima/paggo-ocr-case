// apps/api/src/documents/documents.controller.ts
import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,  
  Param,  
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '@prisma/client';
import { DocumentsService } from './documents.service';
import { CustomFileTypeValidator } from './validators/file-type.validator';
import { QueryDto } from './dto/query.dto'; 

@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new CustomFileTypeValidator({
            allowedTypes: /application\/pdf|image\/jpeg|image\/png/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: { user: User },
  ) {
    return this.documentsService.handleUpload(file, req.user);
  }

  // ======================================================
  // ## NOVO ENDPOINT PARA INTERAÇÃO COM O LLM ##
  // ======================================================
  @Post(':id/query')
  queryDocument(
    @Param('id') documentId: string, 
    @Req() req: { user: User },      
    @Body() queryDto: QueryDto,      
  ) {
    return this.documentsService.queryDocument(
      documentId,
      req.user,
      queryDto.prompt,
    );
  }
}