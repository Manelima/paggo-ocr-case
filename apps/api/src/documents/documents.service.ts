// apps/api/src/documents/documents.service.ts
import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private genAI: GoogleGenerativeAI; 

  constructor(
  private prisma: PrismaService,
  private config: ConfigService,
) {
  const apiKey = this.config.get('GOOGLE_API_KEY');
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY não está definida no arquivo .env');
  }
  this.genAI = new GoogleGenerativeAI(apiKey);
}

  // ===================================
  // == MÉTODO DE UPLOAD E OCR (INTACTO) ==
  // ===================================
  async handleUpload(file: Express.Multer.File, user: User) {
    this.logger.log(`Recebido ${file.mimetype} ${file.originalname} do usuário ${user.email}`);

    const document = await this.prisma.document.create({
      data: {
        fileName: file.originalname,
        status: 'PROCESSING',
        userId: user.id,
      },
    });

    this.processDocument(file, document.id);

    return {
      message: 'Arquivo recebido e está sendo processado.',
      documentId: document.id,
    };
  }

  private async processDocument(file: Express.Multer.File, documentId: string) {
    this.logger.log(`Iniciando processamento para o documento ${documentId}...`);
    let extractedText = '';

    try {
      if (file.mimetype === 'application/pdf') {
        this.logger.log('Arquivo é um PDF, usando pdf-parse...');
        const data = await pdf(file.buffer);
        extractedText = data.text;
      } else if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
        this.logger.log('Arquivo é uma imagem, usando Tesseract.js...');
        const worker = await createWorker('por');
        const ret = await worker.recognize(file.buffer);
        extractedText = ret.data.text;
        await worker.terminate();
      } else {
        throw new Error(`Tipo de arquivo não suportado: ${file.mimetype}`);
      }

      this.logger.log(`Processamento concluído para ${documentId}.`);

      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          extractedText: extractedText,
          status: 'COMPLETED',
        },
      });
    } catch (error) {
      this.logger.error(`Falha no processamento para ${documentId}`, error);
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'FAILED' },
      });
    }
  }

  // ======================================================
  // == MÉTODO DE INTERAÇÃO COM LLM (AGORA COM GEMINI) ==
  // ======================================================
 async queryDocument(documentId: string, user: User, prompt: string) {
  const document = await this.prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) throw new NotFoundException('Documento não encontrado.');
  if (document.userId !== user.id) throw new ForbiddenException('Acesso negado a este documento.');
  if (document.status !== 'COMPLETED' || !document.extractedText) {
    throw new NotFoundException('O texto do documento ainda não foi extraído ou o processamento falhou.');
  }

  this.logger.log(`Iniciando chamada LLM (Gemini) para o documento ${documentId}...`);

  const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  
  const fullPrompt = `Com base no seguinte texto de um documento, responda à pergunta do usuário.\n\n--- TEXTO DO DOCUMENTO ---\n${document.extractedText}\n--------------------------\n\n--- PERGUNTA DO USUÁRIO ---\n${prompt}\n---------------------------`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const llmAnswer = response.text();

  await this.prisma.document.update({
    where: { id: documentId },
    data: {
      llmInteractions: {
        push: { prompt, answer: llmAnswer, timestamp: new Date() },
      },
    },
  });

  return { answer: llmAnswer };
}
}