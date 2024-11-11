import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserAuth, User, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';
import { adaptOffersToClient, adaptOfferToClient } from '../utils/adapterToClient/adaptOffersToClient';
import { FullOfferDTO } from '../dto/offer/full-offer.dto';
import { adaptCreateOfferToServer } from '../utils/adapterToServer/adartCreateOfferToServer';
import { CreateOfferDTO } from '../dto/offer/create-offer.dto';
import { adaptCommentsToClient, adaptCommentToClient } from '../utils/adapterToClient/adaptCommentsToClient';
import { CommentDTO } from '../dto/comment/comment.dto';
import { adaptCreateCommentToServer } from '../utils/adapterToServer/adaptCreateCommentToServer';
import { CreateCommentDTO } from '../dto/comment/create-comment.dto';
import { UserDTO } from '../dto/user/user.dto';
import { CreateUserDTO } from '../dto/user/create-user.dto';
import { adaptSignUpToServer } from '../utils/adapterToServer/adaptSignUpToServer';
import { adaptEditOfferToServer } from '../utils/adapterToServer/adaptEditOfferToServer';
import { errorHandle } from '../utils/errorHandle';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<FullOfferDTO[]>(ApiRoute.Offers);

      return adaptOffersToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<FullOfferDTO[]>(ApiRoute.Favorite);
  
      return adaptOffersToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<FullOfferDTO>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (err) {
      errorHandle(err);

      const axiosError = err as AxiosError;

      if (axiosError.response?.status === HttpCode.NOT_FOUND) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(err);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.post<FullOfferDTO>(ApiRoute.Offers, adaptCreateOfferToServer(newOffer));
      history.push(`${AppRoute.Property}/${data.id}`);

      return adaptOfferToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.patch(`${ApiRoute.Offers}/${offer.id}`, adaptEditOfferToServer(offer));
      history.push(`${AppRoute.Property}/${data.id}`);

      return adaptOfferToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      await api.delete<{ id: string }>(`${ApiRoute.Offers}/${id}`);
      history.push(AppRoute.Root);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<FullOfferDTO[]>(`${ApiRoute.Premium}?city=${cityName}`);
  
      return adaptOffersToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<CommentDTO[]>(`${ApiRoute.Comments}/?offerId=${id}`);
  
      return adaptCommentsToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<UserDTO>(ApiRoute.Login);

      return data.email;
    } catch (err: unknown) {
      errorHandle(err);

      const axiosError = err as AxiosError;

      if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
        Token.drop();
      }

      return Promise.reject(err);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    try {
      const { data } = await api.post<UserDTO & { token: string }>(ApiRoute.Login, { email, password });
      const { token } = data;
  
      Token.save(token);
      history.push(AppRoute.Root);
  
      return email;
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {
    localStorage.removeItem("token");

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const dataContent: CreateUserDTO = adaptSignUpToServer({
      email,
      password,
      name,
      type,
    });
    try {
      const { data } = await api.post<{ id: string }>(ApiRoute.Register, dataContent);

      if (avatar) {
        const payload = new FormData();
        payload.append('avatarPath', avatar);
        await api.post(`/users/${data.id}${ApiRoute.Avatar}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      history.push(AppRoute.Login);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;

    try {
      const bodyContent: CreateCommentDTO = adaptCreateCommentToServer(id, { comment, rating });
      const { data } = await api.post<CommentDTO>(`${ApiRoute.Comments}`, bodyContent);
  
      return adaptCommentToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.post(
      `${ApiRoute.Favorite}`, { offerId: id }
    );

    const { data } = await api.get<FullOfferDTO>(`${ApiRoute.Offers}/${id}`);

    return adaptOfferToClient(data);

  } catch (err: unknown) {
    errorHandle(err);

    const axiosError = err as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(err);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.delete<Offer>(
      `${ApiRoute.Favorite}/${id}`
    );

    const { data } = await api.get<FullOfferDTO>(`${ApiRoute.Offers}/${id}`);

    return adaptOfferToClient(data);
  } catch (err: unknown) {
    errorHandle(err);

    const axiosError = err as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(err);
  }
});
