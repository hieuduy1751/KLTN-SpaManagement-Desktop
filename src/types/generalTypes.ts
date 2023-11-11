import { ReactNode } from 'react';

export type WithChildrenProps<T = undefined> = T extends undefined
  ? {
      children?: ReactNode;
    }
  : T & {
      children?: ReactNode;
    };

export type PaginationType = {
  pagination: {
    current: number 
    pageSize: number
    total: number
  }
}