import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { New } from './schemas/new.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(New.name) private newModel: Model<New>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async createNews(staffId: string ,data: CreateNewDto, file?: Express.Multer.File) {
        if(!mongoose.Types.ObjectId.isValid(staffId)) throw new NotFoundException('Author ID is invalid!');
        const author = await this.userModel.findById(staffId);
        if(!author) throw new NotFoundException('Author not found!');
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file, 'news');
            data.image = uploadResult.secure_url; // gán url vào object update
        }
        const createNews = new this.newModel(data);
        await createNews.save()

        await this.userModel.updateOne(
            {_id: author._id},
            {$push: {news: createNews._id}}
        );
        return {message: 'News created successfully!'}
    }

    async findAllNews() {
        return this.newModel.find();
    }

    async findNewsById(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('News not found!');
        const news = await this.newModel.findById(id);
        if(!news) throw new NotFoundException('News not found!');
        return news
    }

    async updateNews(id: string, data: UpdateNewDto, file?: Express.Multer.File) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('News not found!');
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file, 'news');
            data.image = uploadResult.secure_url; // gán url vào object update
        }
        const news = await this.newModel.findByIdAndUpdate(id, data);
        if(!news) throw new NotFoundException('News not found!');
        return {message: 'News updated successfully!'};
    }

    async deleteNews(id: string) {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException('News not found!');
        const news = await this.newModel.findByIdAndDelete(id);
        if(!news) throw new NotFoundException('News not found!');
        await this.userModel.updateOne(
            {news: id},
            {$pull: {news: id}},
        )
        return {message: 'News deleted successfully!'};
    }
}
