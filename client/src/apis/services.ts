import apisauce from "apisauce";
import * as consts from "../consts";
import { ActivatePromotionResponse, ServicesListResponse } from "../types";
import * as utils from "../utils";

export const list = (page?: number) => {
  const token = utils.auth.getToken();
  const api = apisauce.create({
    baseURL: consts.BASE_API_URL,
    headers: {
      authorization: token,
    },
  });

  return api.get<ServicesListResponse>("/services/list", {
    page: page ?? 1,
  });
};

export const get = () => {};

export const activateBonus = (promoCode: string) => {
  const token = utils.auth.getToken();
  const api = apisauce.create({
    baseURL: consts.BASE_API_URL,
    headers: {
      authorization: token,
    },
  });

  return api.post<ActivatePromotionResponse>("/services/activate-promo", {
    code: promoCode,
  });
};
