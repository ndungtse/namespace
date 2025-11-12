export const getSubdomainUrl = (username: string) => {
  //   const rootDomain = process.env.ROOT_DOMAIN || "localhost";
  //   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  //   const subdomainUrl = `${protocol}://${username}.${rootDomain}`;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";
  const protocol =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "https"
      : "http";
  const port =
    typeof window !== "undefined" && window.location.port
      ? `:${window.location.port}`
      : "";
  const subdomainUrl = `${protocol}://${username}.${rootDomain}${port}`;

  return subdomainUrl;
};

export const getHomepageUrl = () => {
  if (typeof window !== "undefined") {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    const port = window.location.port ? `:${window.location.port}` : "";
    const homepageUrl = `${protocol}://${rootDomain}${port}`;
    return homepageUrl;
  }
  return null;
};
