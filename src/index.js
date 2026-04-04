// AUTHENTICATION RELATED APIs
export { emailVerify } from "./api/auth/emailVerify";
export { sendAuthToken } from "./api/auth/sendAuthToken";
export { login } from "./api/auth/login";
export { logout } from "./api/auth/logout";
export { signup } from "./api/auth/signup";

//  CHANNEL RELATED APIs
export { createChannel } from "./api/channel/createChannel";
export { deleteChannel } from "./api/channel/deleteChannel";
export { getChannel } from "./api/channel/getChannel";
export { updateChannel } from "./api/channel/updateChannel";
export {
  subscribedChannelIdsFromMePayload,
  viewerOwnChannelIdFromMe,
  toggleChannelSubscription,
} from "./api/channel/channelSubscribe";

//  VIDEO RELATED APIs
export { getOverview } from "./api/video/getOverview";
export { getVideo } from "./api/video/getVideo";
export { updateVideoInteraction } from "./api/video/Engagement";
export { uploadVideo } from "./api/video/uploadVideo";
export { watchVideo } from "./api/video/watchVideo";
export { deleteVideo } from "./api/video/deleteVideo";
export { updateVideo } from "./api/video/updateVideo";

//  USER RELATED APIs
export { getMe } from "./api/user/getMe";
export { updateUser } from "./api/user/updateUser";

//  SEARCH (search microservice — same routes as web mfe_shared)
export { searchVideos } from "./api/search/searchVideos";
export { searchWires } from "./api/search/searchWires";
export { globalSearch } from "./api/search/globalSearch";

//  WIRE RELATED APIs
export { createWire } from "./api/wire/createWire";
export { deleteWire } from "./api/wire/deleteWire";
export { getWire } from "./api/wire/getWire";
export { getAllWires } from "./api/wire/getAllWires";
export { postWireEngagement } from "./api/wire/postWireEngagement";
export { updateWire } from "./api/wire/updateWire";

// UTILITY FUNCTIONS
export { default as calculateTimeAgo } from "./utils/calculateTimeAgo";
