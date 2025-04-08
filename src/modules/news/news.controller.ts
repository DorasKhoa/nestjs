import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NewsService } from './news.service';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/common/enums/role.enum';
import { CreateNewDto } from './dto/create-new.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateNewDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  //========= ADMIN + STAFF =========
  //tạo bài đăng mới
  //truyền vào 3 tham số:
  //id của người đăng, dữ liệu bài đăng và ảnh của bài đăng (lưu trên cloudinary)
  @Post()
  @Roles(Role.STAFF, Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  createNew(
    @Request() req:any,
    @Body() createNewDto: CreateNewDto,
    @UploadedFile() file?:Express.Multer.File
  ) {
    return this.newsService.createNews(req.user._id ,createNewDto, file)
  }

  //========= ADMIN + STAFF =========
  //chỉnh sửa bài đăng theo id
  //truyền vào 3 tham số(optional):
  //id của người đăng, dữ liệu bài đăng và ảnh của bài đăng (lưu trên cloudinary)
  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @UseInterceptors(FileInterceptor('image'))
  updateNews(
    @Param('id') id: string,
    @Body() updateNewDto: UpdateNewDto,
    @UploadedFile() file?:Express.Multer.File
  ) {
    return this.newsService.updateNews(id, updateNewDto, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  deleteNews(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }

  //========= ALL =========
  @Get()
  findAllNew() {
    return this.newsService.findAllNews()
  }

  @Get(':id')
  findNewById(@Param('id') id: string) {
    return this.newsService.findNewsById(id);
  }
}
