import * as types from '../constants/actionTypes';
import $ from 'jquery';
import API from '../components/api'
import history from '../history';
import { getUserToken } from '../components/auth';


export const fetchLoginData = (params) => {
    return (dispatch) => {
        var settings = {
            "url": API.GetToken,
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            "data": {
              "grant_type": "password",
              "userName": params.username,
              "password": params.password
            }
          }
          $.ajax(settings).done(function (response) {
          })
          .then(response => {
            window.localStorage.setItem('cf_sales_token', response.access_token);
            window.localStorage.setItem('cf_sales_userName', response.userName);
            window.localStorage.setItem('cf_sales_roles', response.roles);
            // getUserData(params.username);
            dispatch(fetchLoginDataSuccess(response));
            history.push('/user')
        })
        .catch(err => {
            dispatch(fetchLoginDataFail(err.responseJSON.error_description));
        });
    };
}

const getUserData = (username) => {
    var settings = {
        "url": API.GetUserDataByName + username,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+getUserToken(),
    }
    }
    $.ajax(settings).done(function (response) {
    })
    .then(response => {
      console.log("dsfsd==========>", response);
  })
  .catch(err => {
      
  });
}


//login fail
export const fetchLoginDataFail = (param) => {
    return {
        type: types.FETCH_LOGIN_FAIL,
        error:param
    }
}

//login success
export const fetchLoginDataSuccess = (data) => {
    
    return {
        type: types.FETCH_LOGIN_SUCCESS,
        UserName:data.userName,
        Role:data.roles
    }
}
//change lang
export const changeLan = (params) => {
    return (dispatch) => {
        window.localStorage.setItem('cf_sales_lang',  params.value);
        window.localStorage.setItem('cf_sales_label',  params.label);
        dispatch(fetchChangeLan(params.value));
    };
}

export const fetchChangeLan = (value) => {
    return{
        type: types.FETCH_LANGUAGE_DATA,
        lang:value
    }
}

export const blankdispatch = () => {
    return (dispatch) => {
        dispatch(fetchBlankData());
    };
}
//error
export const fetchBlankData = () => {
    return{
        type: types.FETCH_BlANK_DATA,
        error:""
    }
}

export const dataServerFail = (params) => {
    return (dispatch) => {
        dispatch(fetchDataServerFail(params));
    };
}
//error
export const fetchDataServerFail = (params) => {
    return{
        type: types.FETCH_SERVER_FAIL,
        error:params
    }
}

