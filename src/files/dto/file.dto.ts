import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FileResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
  @ApiProperty({ required: false }) data?: any;
}

export class FilesListResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
  @ApiProperty({ type: [Object] }) data: any[];
  @ApiProperty() pagination: any;
}

export class UpdateFileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() originalname?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mimetype?: string;
}
