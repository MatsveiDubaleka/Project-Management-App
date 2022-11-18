import React from 'react';
import { useForm } from 'react-hook-form';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LockIcon from '@mui/icons-material/Lock';

import styled from 'styled-components';
import { IAuthorizationResult, IFormInputs } from 'types/types';
import { LOCAL_STORAGE_DATA, nameRegex, passwordRegex } from 'constants/registration';
import { createUser, getUserDataByLogin, loginUser } from 'api/registerService';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setToken } from 'store/slices/authSlice';
import { Navigate } from 'react-router-dom';

interface IRegForm {
  type: string;
}

const RegForm: React.FC<IRegForm> = ({ type }: IRegForm) => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IFormInputs>();

  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const onFormSubmit = handleSubmit((data: IFormInputs) => {
    if (type === 'signup') {
      (async () => {
        const user = await createUser(data);
        if (user._id) {
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
          }
        } else if (user.login === 'Login already exist') {
          console.log('Login already exist');
        } else {
          console.log('Something went wrong.');
        }
      })();
    } else {
      (async () => {
        const authUser = await loginUser(data);
        if (authUser.token) {
          const currentUserData =
            localStorage.getItem(LOCAL_STORAGE_DATA) &&
            JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)).token !== ''
              ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA))
              : await getUserDataByLogin(data.login, authUser.token);
          currentUserData.token = authUser.token;
          localStorage.setItem(LOCAL_STORAGE_DATA, JSON.stringify(currentUserData));
          dispatch(setToken(authUser.token));
        } else {
          console.log('Something went wrong.');
        }
      })();
    }
    reset();
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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Name"
              id="username"
              {...register('name', {
                required: {
                  value: true,
                  message: '*this field must be filled in',
                },
                minLength: {
                  value: 3,
                  message: '*at least 3 characters',
                },
                maxLength: {
                  value: 30,
                  message: '*maximum of 30 characters',
                },
                pattern: {
                  value: nameRegex,
                  message: '*login must contain only Latin characters',
                },
              })}
            />
          </>
        ) : null}

        <label htmlFor="login">Login</label>
        <input
          type="text"
          placeholder="Login"
          id="login"
          {...register('login', {
            required: {
              value: true,
              message: '*this field must be filled in',
            },
            minLength: {
              value: 3,
              message: '*at least 3 characters',
            },
            maxLength: {
              value: 30,
              message: '*maximum of 30 characters',
            },
            pattern: {
              value: nameRegex,
              message: '*login must contain only Latin characters',
            },
          })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          {...register('password', {
            required: {
              value: true,
              message: '*this field must be filled in',
            },
            minLength: {
              value: 8,
              message: '*at least 8 characters',
            },
            maxLength: {
              value: 30,
              message: '*maximum of 30 characters',
            },
            pattern: {
              value: passwordRegex,
              message:
                '*password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? "',
            },
          })}
        />
        {type === 'signup' ? <button>Sign Up</button> : <button>Log In</button>}
      </form>
      {token !== '' ? <Navigate to="/boards" /> : null}
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
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
  }
`;
