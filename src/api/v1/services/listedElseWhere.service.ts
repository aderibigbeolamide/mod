import { dataSource } from "../../../config/database.config.js";
import { ListedElseWhereEntity } from "../entities/listedElseWhere.entity.js";
import { CreateListedElseWhereDto } from "../dtos/listedElseWhere.dto.js";
import { ListedElseWhere } from "../interfaces/listedElseWhere.interface.js";
import { HttpException } from "../exceptions/http.exception.js";
import { STATUS_FAIL } from "../../../config/constants.js";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity.js";

export default class ListedElseWhereService {
    repo = dataSource.getRepository(ListedElseWhereEntity);
    userRepo = dataSource.getRepository(UserEntity);
    
    public async createListedElseWhere(userId: string, createDto: CreateListedElseWhereDto): Promise<ListedElseWhere> {
        try {
            // Verify user exists
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new HttpException(404, STATUS_FAIL, "User not found", "USER_NOT_FOUND");
            }
            // Create the listing
            const listing = new ListedElseWhereEntity();
            listing.userId = userId;
            listing.propertyLink = createDto.propertyLink;
            listing.propertyAddress = createDto.propertyAddress;
            listing.description = createDto.description || null;
            
            await this.repo.save(listing);
            return listing;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, STATUS_FAIL, "Failed to create listing", "LISTING_CREATION_FAILED");
        }
    }

    public async getListingsByUser(userId: string): Promise<ListedElseWhere[]> {
        try {
            // Verify user exists
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new HttpException(404, STATUS_FAIL, "User not found", "USER_NOT_FOUND");
            }
            // Fetch listings
            const listings = await this.repo.find({ where: { userId } });
            return listings;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, STATUS_FAIL, "Failed to fetch listings", "FETCH_LISTINGS_FAILED");
        }
    }

    public async deleteListing(userId: string, listingId: string): Promise<void> {
        try {
            // Verify user exists
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new HttpException(404, STATUS_FAIL, "User not found", "USER_NOT_FOUND");
            }
            // Verify listing exists and belongs to user
            const listing = await this.repo.findOne({ where: { id: listingId, userId } });
            if (!listing) {
                throw new HttpException(404, STATUS_FAIL, "Listing not found", "LISTING_NOT_FOUND");
            }
            // Delete the listing
            await this.repo.remove(listing);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, STATUS_FAIL, "Failed to delete listing", "DELETE_LISTING_FAILED");
        }
    }
}