const Auth= {
    isAuthenticated: false,
    redirected: false,
    authenticate() {
        this.isAuthenticated = true;        
    },
    signout() {
        this.isAuthenticated = false;
    },
    setRedirect(k)
    {
        this.redirected = k;
    },
    getRedirect()
    {
        return this.redirected;
    },
    getAuth() {
        return localStorage.getItem('usertoken');
    }
};
export default Auth;