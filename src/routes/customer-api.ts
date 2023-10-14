import {Router} from 'express';
import HomePageController from "@controller/Customer/HomePageController";
import ContactController from "@controller/admin/ContactController";
import {auth} from "@util/auth";
import uploader from "@util/local-uploader";

import isCached, {isCachedParams, isCachedSA, isCachedDash} from "@util/redis";
import GiftCardController from "@controller/Customer/GiftCardController";
import ReferralController from "@controller/Customer/ReferralController";

export const p = {
  basePath: '/',
  homePage: '/home-page',
  services: '/services',
  service: '/service/:slug',
  blogs: '/blogs',
  blog: '/blog/:slug',
  product: '/product/:slug',
  checkServiceArea: '/service-area',
  checkCoupon: '/apply-coupon',
  orderWithDriver: '/order-with-driver',
  order: '/order',
  orderCompletion: '/order-completion',
  dashboard: '/dashboard',
  updateUser: '/user-update',
  changePassword: '/password-change',
  videos: '/videos',
  orderInfo: '/order-info',
  contactUs: '/contact-us',
  settings: '/site-settings',
  review: '/add-review',
  search: '/search',
  adminSearch: '/admin-search',
  giftCardPrices: '/gift-card-prices',
  giftCardTemplates: '/gift-card-templates',
  SendGiftCard: '/send-gift-card',
  generateReferralCode: '/generate-referral-code',
  sendReferralCode: '/send-referral-code',
  getGiftCards: '/get-gift-cards',
  updateItemsSlug: '/update-item-slug'
} as const;
// Init
const customerApi = Router();

customerApi.get(p.homePage, isCached('homePage'), HomePageController.homePage);
customerApi.get(p.services, isCached('services'), HomePageController.services);
customerApi.get(p.service, isCachedParams('service-'), HomePageController.service);
customerApi.get(p.blogs, isCached('blogs'), HomePageController.blogs);
customerApi.get(p.blog, HomePageController.blog);
customerApi.get(p.product, isCachedParams('product-'), HomePageController.product);
customerApi.get(p.videos, isCachedParams('videos'), HomePageController.videos);
customerApi.post(p.checkServiceArea, isCachedSA, HomePageController.serviceAreas);
customerApi.post(p.checkCoupon, HomePageController.checkCoupon);
customerApi.post(p.orderWithDriver, HomePageController.orderWithDriver);
customerApi.post(p.order, HomePageController.order);
customerApi.post(p.orderCompletion, HomePageController.orderCompletion);
customerApi.post(p.dashboard, auth, HomePageController.dashboard);
customerApi.post(p.updateUser, auth, HomePageController.updateUser);
customerApi.post(p.changePassword, auth, HomePageController.changePassword);
customerApi.post(p.orderInfo, HomePageController.orderInfo);
customerApi.post(p.contactUs, ContactController.add);
customerApi.get(p.settings, HomePageController.siteSettings);
customerApi.get(p.search, HomePageController.search);
customerApi.get(p.adminSearch, HomePageController.adminSearch);
customerApi.post(p.review, auth, uploader.fields([{name: 'images', maxCount: 10}]), HomePageController.review);
customerApi.get(p.giftCardPrices, GiftCardController.prices);
customerApi.get(p.giftCardTemplates, GiftCardController.templates);
customerApi.post(p.SendGiftCard, GiftCardController.add);
customerApi.get(p.generateReferralCode, auth, ReferralController.generateReferralCode);
customerApi.post(p.sendReferralCode, auth, ReferralController.sendReferralCodeByEmail);
customerApi.get(p.updateItemsSlug, HomePageController.updateItemForSlug);

export default customerApi;