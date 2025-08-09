// apps/api/src/documents/documents.service.ts
import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';

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
  // == MÉTODO DE UPLOAD E OCR ==
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

  // ===================================
  // == MÉTODO PARA BUSCAR DOCUMENTO ==
  // ===================================
  async getDocumentById(documentId: string, user: User) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new NotFoundException('Documento não encontrado.');
    if (document.userId !== user.id) throw new ForbiddenException('Acesso negado a este documento.');

    return document;
  }

  // ======================================================
  // == MÉTODO DE INTERAÇÃO COM LLM (COM GEMINI) ==
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

    // ======================================================
    // == MÉTODO PARA BUSCAR TODOS OS DOCUMENTOS DO USUÁRIO ==
    // ======================================================
    async getAllDocumentsForUser(user: User) {
    this.logger.log(`Buscando todos os documentos para o usuário ${user.email}`);
    return this.prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }, 
    });
  }

async getDocumentForDownload(documentId: string, user: User) {
  const document = await this.prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) throw new NotFoundException('Documento não encontrado.');
  if (document.userId !== user.id) throw new ForbiddenException('Acesso negado.');

  let content = `RELATÓRIO DO DOCUMENTO: ${document.fileName}\n`;
  content += `========================================\n\n`;
  content += `STATUS: ${document.status}\n`;
  content += `DATA DE CRIAÇÃO: ${new Date(document.createdAt).toLocaleString()}\n\n`;
  content += `--- TEXTO EXTRAÍDO (OCR) ---\n`;
  content += `${document.extractedText || 'Nenhum texto extraído.'}\n\n`;
  content += `--- INTERAÇÕES COM IA ---\n`;

  const interactions = document.llmInteractions as any[];
  if (interactions.length > 0) {
    interactions.forEach(interaction => {
      content += `\n[PERGUNTA]: ${interaction.prompt}\n`;
      content += `[RESPOSTA]: ${interaction.answer}\n`;
    });
  } else {
    content += `Nenhuma interação registrada.`;
  }

  return content;
}

// ======================================================
// == MÉTODO PARA GERAR RELATÓRIO PDF ==
// ======================================================
async generatePdfReport(document: any): Promise<Buffer> {
    this.logger.log(`Gerando relatório PDF com pdfkit para o documento ${document.id}`);
    const interactions = document.llmInteractions as any[];

    // O pdfkit trabalha com Buffers, então criamos uma Promise para aguardar a finalização
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: any[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Construindo o conteúdo do PDF
        doc.fontSize(20).font('Helvetica-Bold').text(`Relatório do Documento: ${document.fileName}`, { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica').text(`Status: ${document.status}`);
        doc.text(`Data de Criação: ${new Date(document.createdAt).toLocaleString('pt-BR')}`);
        doc.moveDown(2);

        doc.fontSize(16).font('Helvetica-Bold').text('Texto Extraído (OCR)');
        doc.rect(doc.x, doc.y, 510, 1).fill('#ccc').moveDown(0.5);
        doc.fontSize(10).font('Courier').text(document.extractedText || 'Nenhum texto extraído.', { align: 'justify' });
        doc.moveDown(2);

        doc.fontSize(16).font('Helvetica-Bold').text('Interações com IA');
        doc.rect(doc.x, doc.y, 510, 1).fill('#ccc').moveDown(0.5);

        if (interactions && interactions.length > 0) {
            interactions.forEach((interaction) => {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#004499').text(`\nSua Pergunta:`);
                doc.fontSize(11).font('Helvetica').fillColor('#333').text(interaction.prompt);
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#10b981').text(`\nResposta da IA:`);
                doc.fontSize(11).font('Helvetica').fillColor('#333').text(interaction.answer);
                doc.moveDown();
            });
        } else {
            doc.fontSize(11).font('Helvetica').text('Nenhuma interação registrada.');
        }

        // Finaliza o documento
        doc.end();
    });
}
}