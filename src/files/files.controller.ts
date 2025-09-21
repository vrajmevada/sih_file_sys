import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UploadedFile,
  UseInterceptors, HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiConsumes, ApiBody, ApiQuery,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import {
  FileResponseDto,
  FilesListResponseDto,
  UpdateFileDto,
} from './dto/file.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @ApiResponse({ status: 201, type: FileResponseDto })
  async upload(@UploadedFile() file: Express.Multer.File): Promise<FileResponseDto> {
    if (!file) throw new HttpException('No file', HttpStatus.BAD_REQUEST);
    const saved = await this.filesService.uploadFile(file);
    return { success: true, message: 'Uploaded', data: saved };
  }

  @Get()
  @ApiOperation({ summary: 'List files' })
  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: FilesListResponseDto })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<FilesListResponseDto> {
    const p = Math.max(1, +page), l = Math.min(100, +limit);
    const res = await this.filesService.getFiles(p, l);
    return { success: true, message: 'OK', data: res.files, pagination: res.pagination };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateFileDto) {
    return await this.filesService.updateFile(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.filesService.deleteFile(id);
    return { success: true };
  }
}
