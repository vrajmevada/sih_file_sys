import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async uploadFile(file: Express.Multer.File): Promise<FileDocument> {
    const doc = new this.fileModel({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });
    return await doc.save();
  }

  async getFiles(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const files = await this.fileModel.find().skip(skip).limit(limit).exec();
    const total = await this.fileModel.countDocuments();
    return { files, pagination: { current_page: page, total_files: total, files_per_page: limit, total_pages: Math.ceil(total/limit) } };
  }

  async updateFile(id: string, dto: any) {
    const updated = await this.fileModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Not found');
    return updated;
  }

  async deleteFile(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) throw new NotFoundException('Not found');
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await this.fileModel.findByIdAndDelete(id);
  }
}
