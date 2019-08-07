import axios from 'axios';

export const HTTP = axios.create({
  baseURL: `https://10.42.0.1:3000`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }
})

export const HTTP_CODES = {
    Ok: 200,
    NotFound: 404,
    Unauthorized: 401,
    CreateOrEdit: 201 
}

export const Unauthorized = (router, status) => {
  if(status === HTTP_CODES.Unauthorized){
    localStorage.removeItem("token");
    router.replace({name: "login"});
    
    return true;
  }

  return false;
}