import { dataSource } from "../../../config/database.config.js";
import { WishlistEntity } from "../entities/wishlist.entity.js";
import LocationService from "./location.service.js";

export default class SetupService { 
  
  public static async initiate() {
    const location = await LocationService.loadStatesAndLGAs(); 
    return location;
 }
}
