const SessionStorage = {
    storeData: (KEY:string, data:any) => {
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(data));
      } catch (e) {
        // saving error
        console.log("Storage error: ", e);
      }
    },
    getData: (KEY:string) => {
      try {
        const value = window.sessionStorage.getItem(KEY);
        console.log(value);
        if (value !== null) {
          return JSON.parse(value);
        } else {
          return null;
        }
      } catch (e) {
        console.log("Storage retrieve error: ", e);
      }
      return null;
    },
    delete: (KEY:string) => {
      window.sessionStorage.removeItem(KEY);
    },
  };
  
  export default SessionStorage;
  