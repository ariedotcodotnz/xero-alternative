
const redirectToExternalURL = async (url: string) => {
  const w = window as Window
  w.location = url;    
}

export default redirectToExternalURL