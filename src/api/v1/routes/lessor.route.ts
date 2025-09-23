import Utility from "../../../utils/utility.js";
import LessorController, { lessorProps } from "../controllers/lessor.controller.js";
import { LessorCreateDto, LessorSearchQueryDto } from "../dtos/lessor.dto.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { LessorSample } from "../samples/lessor.sample.js";
import SearchService from "../services/search.service.js";

const LessorRoute = Utility.swaggerRouteToAppRoute({
  path: "lessor",
  controller: LessorController,
  routes: [
    {
      route: `/save`,
      handler: LessorController.save,
      middleWares:[authenticateUser],
      method: "post",
      sampleRequestData: new LessorCreateDto({
        id: "07786501-a741-447d-8c10-836dca6eadf0",
        lessorCategory: LessorCategories.AGENT_OR_COMPANY,
        firstName: "string",
        lastName: "string",
        email: "string",
        phoneNumber: "string",
        agencyName: "string",
      }),
      description: `id is optional. Only set it if you want to update an existing record`,
      sampleResponseData: {
        status: "success",
        message: "Lessor updated",
        data: {
          id: "07786501-a741-447d-8c10-836dca6eadf0",
          lessorCategory: "AGENT_OR_COMPANY",
          firstName: "string",
          lastName: "string",
          email: "string",
          phoneNumber: "string",
          agencyName: "string",
        },
      },
    },
    {
      route: `/getByID/:id`,
      handler: LessorController.getByID,
      method: "get",
      parameters: [{ name: ":id", in: "path", required: true }],
    },

    {
      route: `/getAllLessors`,
      handler: LessorController.getAllLessors,
      middleWares:[authenticateUser],
      method: "get",
      description: `Use this to get all lessors`,
      sampleResponseData: { data: [lessorProps] },
    },
    
    {
      route: `/getMyLessors`,
      handler: LessorController.getMyLessors,
      middleWares:[authenticateUser],
      method: "get", 
    },
    {
      route: `/search`,
      handler: LessorController.search,
      method: "get",
      description: `Use this to search for lessors`,
      parameters: SearchService.queryParams(new LessorSearchQueryDto(LessorSample.searchQuery)),
    },
    {
      route: `/props`,
      handler: LessorController.props,
      method: "get",
      sampleResponseData: { data: lessorProps },
    },
  ],
});

export default LessorRoute;
