import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';
import { IAuthorizationResult, IFormInputs } from 'types/types';
import { LOCAL_STORAGE_DATA, nameRegex, passwordRegex } from 'constants/registration';
import { createUser, getUserDataByLogin, loginUser } from 'api/registerService';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setToken, setValidation } from 'store/slices/authSlice';
import '../utils/i18n';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { updateUser } from 'api/usersServices';
import { Endpoint } from 'constants/endpoints';
import store from 'store';

interface IRegForm {
  type: string;
  handleClose?: () => void;
  userId?: string;
  token?: string;
  userName?: string;
  login?: string;
}

const RegForm: React.FC<IRegForm> = ({
  type,
  handleClose,
  userId,
  token,
  userName,
  login,
}: IRegForm) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormInputs>();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const isValidated = useAppSelector((state) => state.auth.isValidated);
  const modal = useAppSelector((store) => store.auth.modal);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  const onFormSubmit = handleSubmit((data: IFormInputs) => {
    if (type === 'signup' && modal === '') {
      (async () => {
        setLoading(true);
        const user = await createUser(data);
        if (user && user._id) {
          const currentUser = Object.assign(user, { token: '' });
          localStorage.setItem(`${LOCAL_STORAGE_DATA}`, JSON.stringify(currentUser));
          const authUser = (await loginUser({
            login: user.login,
            password: data.password,
          })) as IAuthorizationResult;
          if (authUser.token) {
            const currentUserWithToken = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`));
            currentUserWithToken.token = authUser.token;
            localStorage.setItem(`${LOCAL_STORAGE_DATA}`, JSON.stringify(currentUserWithToken));
            dispatch(setToken(authUser.token));
            dispatch(setValidation(true));
          }
          reset();
        } else if (user && user.login === 'Login already exist') {
          setError('exist', { message: ' already exists' }, { shouldFocus: true });
        }
        setLoading(false);
      })();
    } else if (type === 'signup' && modal !== '') {
      (async () => {
        setLoading(true);
        const user = await updateUser(userId, token, data);
        if (user && user._id) {
          const updatedUserWithToken = Object.assign(user, { token });
          localStorage.setItem(`${LOCAL_STORAGE_DATA}`, JSON.stringify(updatedUserWithToken));
        }
        reset();
        setLoading(false);
        handleClose();
      })();
    } else {
      (async () => {
        setLoading(true);
        const authUser = await loginUser(data);
        console.log('Login', authUser);
        if (authUser && authUser.token) {
          const currentUserData =
            localStorage.getItem(LOCAL_STORAGE_DATA) &&
            JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token !== ''
              ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA))
              : await getUserDataByLogin(data.login, authUser.token);
          currentUserData.token = authUser.token;
          localStorage.setItem(LOCAL_STORAGE_DATA, JSON.stringify(currentUserData));
          dispatch(setToken(authUser.token));
          dispatch(setValidation(true));
          reset();
        } else if (authUser.error.message) {
          setError('wrong', { message: `Login or password is not correct` });
        }
        setLoading(false);
      })();
    }
  });
  return (
    <Register>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={onFormSubmit}>
        {type === 'signup' ? (
          <LockPersonIcon sx={{ fontSize: '50px', alignSelf: 'center' }} />
        ) : (
          <LockIcon sx={{ fontSize: '50px', alignSelf: 'center' }} />
        )}

        {type === 'signup' ? (
          <>
            <label htmlFor="username">{t('username')}</label>
            <input
              type="text"
              placeholder="Name"
              id="username"
              defaultValue={modal !== '' ? userName : ''}
              // autoFocus={modal === 'updateName' ? true : false}
              {...register('name', {
                required: {
                  value: true,
                  message: t('thisFieldMustBe'),
                },
                minLength: {
                  value: 3,
                  message: t('atLeast'),
                },
                maxLength: {
                  value: 30,
                  message: t('maximum30'),
                },
              })}
            />
          </>
        ) : null}
        {type === 'signup' ? errors.name && <Tip>{errors.name.message}</Tip> : null}

        <label htmlFor="login">
          {t('login')}
          {type === 'signup'
            ? errors.exist && <span style={{ color: 'red' }}>{errors.exist.message}</span>
            : null}
        </label>
        <input
          type="text"
          placeholder="Login"
          id="login"
          defaultValue={modal !== '' ? login : ''}
          // autoFocus={modal === 'updateLogin' ? true : false}
          {...register('login', {
            onChange: () => clearErrors('exist'),
            required: {
              value: true,
              message: t('thisFieldMustBe'),
            },
            minLength: {
              value: 3,
              message: t('atLeast'),
            },
            maxLength: {
              value: 30,
              message: t('maximum30'),
            },
            pattern: {
              value: nameRegex,
              message: t('latin'),
            },
          })}
        />
        {errors.login && <Tip>{errors.login.message}</Tip>}

        <label htmlFor="password">{t('password')}</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          {...register('password', {
            onChange: () => clearErrors('wrong'),
            required: {
              value: true,
              message: t('thisFieldMustBe'),
            },
            pattern: {
              value: passwordRegex,
              message: t('oneNumberOneLetter'),
            },
            minLength: {
              value: 8,
              message: t('atLeastPassword'),
            },
            maxLength: {
              value: 30,
              message: t('maximum30'),
            },
          })}
        />
        {type === 'login'
          ? errors.wrong && <p style={{ color: 'red' }}>{errors.wrong.message}</p>
          : null}
        {errors.password && <Tip>{errors.password.message}</Tip>}
        {type === 'signup' && modal !== '' ? (
          <Tip>You can input old password or change it now</Tip>
        ) : null}
        {!isLoading ? (
          type === 'signup' && modal !== '' ? (
            <ButtonBox>
              <button className="change-submit">{t('submit')}</button>
              <Button className="change-cancel" onClick={handleClose}>
                CANCEL
              </Button>
            </ButtonBox>
          ) : type === 'signup' ? (
            <button>{t('signup')}</button>
          ) : (
            <button>{t('signin')}</button>
          )
        ) : (
          <CircularProgress sx={{ alignSelf: 'center' }} />
        )}
      </form>
      {isValidated && modal === '' && location.pathname !== Endpoint.PROFILE ? (
        <Navigate to="/boards" />
      ) : null}
    </Register>
  );
};

export default RegForm;

const Register = styled.div`
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    background-color: #080710;
  }
  .background {
    width: 430px;
    height: 520px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
  .background .shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
    z-index: -10;
  }
  .shape:first-child {
    background: linear-gradient(#1845ad, #23a2f6);
    left: -80px;
    top: -80px;
  }
  .shape:last-child {
    background: linear-gradient(to right, #ff512f, #f09819);
    right: -30px;
    bottom: -80px;
  }
  form {
    min-height: 400px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.13);
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  form * {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
  }
  form h3 {
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
  }

  label {
    display: block;
    margin-top: 20px;
    font-size: 1em;
    font-weight: 500;
    text-align: start;
  }
  input {
    display: block;
    height: 50px;
    width: 100%;
    color: black;
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 8px;
    font-size: 1.25em;
    font-weight: 300;
  }

  input::placeholder {
    color: rgb(168, 163, 163);
  }

  button {
    margin-top: 30px;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 10px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #f5f8fa;
    color: #23a2f6;
  }

  button:active {
    transform: scale(0.95);
    box-shadow: 2px 2px 2px darkgray;
  }

  p {
    margin-top: 10px;
  }
`;

const Tip = styled.span`
  color: #383434 !important;
  font-size: 14px;
  font-weight: 200;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 10px;
  width: 80%;
  margin: 0 auto;
  .change-submit,
  .change-cancel {
    width: 50%;
  }
`;
