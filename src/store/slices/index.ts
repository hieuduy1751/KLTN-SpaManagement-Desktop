import userReducer from "./userSlice";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import notificationsReducer from "./notificationsSlice";

export default {
  user: userReducer,
  auth: authReducer,
  users: usersReducer,
  notifications: notificationsReducer,
};
