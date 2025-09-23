import Utility from "../../../utils/utility.js";
import MediaController from "../controllers/media.controller.js";
import {
  uploadFileMiddleWare,
  uploadLargeFileMiddleWare,
} from "../middlewares/multer.middleware.js";
import { MediaSample } from "../samples/media.sample.js";

const MediaRoute = Utility.swaggerRouteToAppRoute({
  path: "media",
  controller: MediaController,
  routes: [
    {
      route: `/`,
      handlerName: "uploadMedia",
      method: "post",
      middleWares: [uploadFileMiddleWare.array("files", 10)],
      requestContentType: "multipart/form-data",
      sampleRequestData: MediaSample.uploadMediaDto,
      description: `Use this to upload up to 10 media files each less than 6mb.`,
      sampleResponseData: Utility.responseFormatter(
        { media: [MediaSample.media] },
        "Media successfully uploaded"
      ),
    },
    {
      route: `/large`,
      handlerName: "uploadMedia",
      method: "post",
      middleWares: [uploadLargeFileMiddleWare.array("files", 5)],
      requestContentType: "multipart/form-data",
      sampleRequestData: MediaSample.uploadMediaDto,
      description: `Use this to upload up to 5 media files each less than 20mb.`,
      sampleResponseData: Utility.responseFormatter(
        { media: [MediaSample.media] },
        "Media successfully uploaded"
      ),
    },
  ],
});

export default MediaRoute;
