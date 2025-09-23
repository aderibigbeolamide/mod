import { dataSource } from "../../../config/database.config.js";
import {
  LocationStateEntity,
  LocationLGAEntity,
  LocationWardsEntity,
} from "../entities/location.entity.js";
import states from "../assets/nigerian-states.json" assert { type: "json" };
import Utility from "../../../utils/utility.js";

export default class LocationService {
  static stateRepo = dataSource.getRepository(LocationStateEntity);
  static lgaRepo = dataSource.getRepository(LocationLGAEntity);
  static wardsRepo = dataSource.getRepository(LocationWardsEntity);

  public static async loadStatesAndLGAs() {
    await dataSource
      .transaction(async (transactionalEntityManager) => {
        // Use raw SQL to truncate with CASCADE due to FK constraints
        await transactionalEntityManager.query(
          `TRUNCATE TABLE "location_wards", "location_lga", "location_state" CASCADE`
        );

        for (const stateItem of states) {
          // Save state
          const state = await transactionalEntityManager.save(
            new LocationStateEntity({ name: stateItem.state })
          );

          for (const lgaItem of stateItem.lgas) {
            // Save LGA with FK to state
            const lga = await transactionalEntityManager.save(
              new LocationLGAEntity({
                name: lgaItem.lga,
                state: state,
              })
            );

            // Save each ward with FK to LGA
            const wardEntities = lgaItem.wards.map(
              (ward) =>
                new LocationWardsEntity({
                  name: ward,
                  lga: lga,
                })
            );

            await transactionalEntityManager.save(wardEntities);
          }
        }
      })
      .catch((e) => {
        Utility.logError(e);
      });
  }


  public static async getAllStates() {
    const states = await this.stateRepo.find({ select: { name: true } });
    return states.sort((a, b) => a.name?.localeCompare(b.name));
  }

  public static async getLGAS({ state }: { state: string }) {
    const lgas = await this.lgaRepo.find({
      where: { state: { name: state } },
      select: { name: true, state: { name: true } },
    });
    return lgas.sort((a, b) => a.name?.localeCompare(b.name));
  }

  public static async getWards({ lga }: { lga: string }) {
    const wards = await this.wardsRepo.find({
      where: { lga: { name: lga } },
      select: { name: true, lga: { name: true } },
    });
    return wards.sort((a, b) => a.name?.localeCompare(b.name));
  }
}
