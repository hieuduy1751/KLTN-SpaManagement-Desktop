import userReducer from "./userSlice";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import customersReducer from "./customerSlice";
import staffsReducer from "./staffSlice";
import servicesSlice from "./serviceSlice";
import productsSlice from './productSlice'

export default {
  user: userReducer,
  auth: authReducer,
  users: usersReducer,
  customers: customersReducer,
  staffs: staffsReducer,
  services: servicesSlice,
  products: productsSlice
};
