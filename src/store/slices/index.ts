import userReducer from "./userSlice";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import customersReducer from "./customerSlice";
import staffsReducer from "./staffSlice";
import servicesSlice from "./serviceSlice";
import productsSlice from "./productSlice";
import appointmentsSlice from "./appointmentSlice";
import treatmentsSlice from "./treatmentSlice";
import invoicesSlice from './invoicesSlice'

export default {
  user: userReducer,
  auth: authReducer,
  users: usersReducer,
  customers: customersReducer,
  staffs: staffsReducer,
  services: servicesSlice,
  products: productsSlice,
  appointments: appointmentsSlice,
  treatments: treatmentsSlice,
  invoices: invoicesSlice
};
