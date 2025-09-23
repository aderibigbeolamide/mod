import { dataSource } from "../../../config/database.config.js";
import { CreateWishListDto, FetchUserWishListDto } from "../dtos/wishlist.dto.js";
import { WishlistEntity } from "../entities/wishlist.entity.js";

export default class WishListService {
  static repo = dataSource.getRepository(WishlistEntity);

  public static async create(dto: CreateWishListDto) {
    const wishlist = new WishlistEntity();
    wishlist.userId = dto.userId;
    wishlist.propertyId = dto.propertyId;
    return await this.repo.save(wishlist);
  }

  public static async fetchUserWishList(userId: string) {
    return await this.repo.find({
      where: {
        userId,
      },
    });
  }

  public static async getWishListById(wishlistId: string) {
    return await this.repo.findOne({
      where: {
        id: wishlistId
      }
    })
  }

  public static async deleteWishList(wishlistId: string) {
    return await this.repo.delete({id: wishlistId})
  }
}
