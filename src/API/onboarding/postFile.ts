//  simple fetch request which allows the browser to dictate the header of the post to be the correct multipart
const postFile = async (file: FormData, route: string) => {
  try {
    const csrfToken: HTMLMetaElement | undefined = document.querySelector(
      "meta[name='csrf-token']",
    );
    const response = await fetch(route, {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken?.content },
      body: file,
    });
    const result = await response;
    return await result.json();
  } catch (error) {
    return null;
  }
};

export default postFile;
