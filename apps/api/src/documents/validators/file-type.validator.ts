// apps/api/src/documents/validators/file-type.validator.ts
import { FileValidator } from '@nestjs/common';

export class CustomFileTypeValidator extends FileValidator<{
  allowedTypes: RegExp;
}> {
  constructor(options: { allowedTypes: RegExp }) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean {
    const fileType = file.mimetype;
    return this.validationOptions.allowedTypes.test(fileType);
  }

  buildErrorMessage(): string {
    return `Validation failed (MIME type ${this.validationOptions.allowedTypes} is expected)`;
  }
}