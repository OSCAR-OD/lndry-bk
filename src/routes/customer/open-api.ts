import {Router} from 'express';

export const p = {
  basePath: '/',
  services: '/services',
  search: '/search',
  banners: '/banners',
  postCode: '/post-code',
  discountServices: '/discount-services',
  popularServices: '/popular-services'
} as const;
// Init
const openAPI = Router();


export default openAPI;