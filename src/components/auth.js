export const getUserToken = () => {
    return(window.localStorage.getItem('cf_sales_token'))
};
export const removeAuth = () => {
    window.localStorage.setItem('cf_sales_token', '')
    window.localStorage.setItem('cf_sales_userName', '')
    window.localStorage.setItem('cf_sales_roles', '')
    return true
};
export const getAuth = () => {
    return(window.localStorage.getItem('cf_sales_token'))
};
export const getUserName = () => {
    return(window.localStorage.getItem('cf_sales_userName'))
};