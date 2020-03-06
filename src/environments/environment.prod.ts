export const environment = {
  production: false,
  api: {
    post: {
      version: "v1/",
      url: "http://localhost:3000/",
      endpoint: "post/"
    },
    user: {
      version: "v1/",
      url: "http://localhost:3000/",
      endpoint: "user/"
    }
  } 
};

export const getApiEndpoint = (apiName: string) => {
  return `${environment.api[apiName].url}${environment.api[apiName].version}api/${environment.api[apiName].endpoint}/`;
}
