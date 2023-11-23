import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { ProductType } from "../../types/product";
import {
  createProduct,
  deleteProduct,
  getProducts as getP,
  updateProduct,
} from "../../services/product";

export interface ProductState {
  loading: boolean;
  products: ProductType[] | undefined;
  selectedProduct: ProductType | undefined;
  pagination: PaginationType;
}

const initialState: ProductState = {
  loading: false,
  products: [],
  selectedProduct: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
  },
};

export const setProducts = createAction(
  "products/doSetProducts",
  (products: ProductType[]) => {
    return {
      payload: products,
    };
  }
);

export const getProducts = createAsyncThunk(
  "products/doGetProducts",
  async ({
    pagination,
  }: {
    pagination: PaginationType;
  }) => {
    const res = await getP("PRODUCT", pagination);
    return {
      products: res,
      pagination,
    };
  }
);

export const addProduct = createAsyncThunk(
  "products/doCreateProduct",
  async (product: ProductType, { dispatch }) => {
    await createProduct(product);
    dispatch(
      getProducts({
        pagination: {
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
          },
        },
      })
    );
  }
);

export const editProduct = createAsyncThunk(
  "products/doEditProduct",
  async ({
    product,
    productId,
  }: {
    product: ProductType;
    productId: string;
  }) => {
    const res = await updateProduct(product, productId);
    return {
      product: res,
    };
  }
);

export const removeProduct = createAsyncThunk(
  "products/doRemoveProduct",
  async (productId: string) => {
    await deleteProduct(productId);
    return {
      productId,
    };
  }
);

export const setPagination = createAction(
  "products/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedProduct = createAction(
  "products/setProduct",
  (product: ProductType) => {
    return {
      payload: product,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProducts, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedProduct, (state, action) => {
      state.selectedProduct = action.payload;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.products = state.products?.map((product) => {
        if (product.id === action.payload.product.id) {
          return action.payload.product;
        }
        return product;
      });
      state.selectedProduct = action.payload.product;
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.products = state.products?.filter(
        (product) => product.id !== action.payload.productId
      );
      state.selectedProduct = undefined;
    });
  },
});

export default productsSlice.reducer;
