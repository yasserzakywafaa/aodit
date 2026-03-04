/**
 * Parse query string to filter object
 */
export const parseQueryString = (queryString: string) => {
  const params = new URLSearchParams(queryString);
  const filters: any = {};
  for (const [key, value] of params.entries()) {
    try {
      filters[key] = JSON.parse(value);
    } catch (e) {
      filters[key] = value;
    }
  }

  return filters;
};

/**
 * Create Query Params to URL
 */
export const createQueryString = (filters: any) => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach((key: any) => {
    const filter = filters[key];
    if (Array.isArray(filter)) {
      if (filter.length > 0) {
        params.append(key, JSON.stringify(filter));
      } else {
        params.append(key, JSON.stringify([]));
      }
    } else if (filter !== undefined && filter !== null) {
      params.append(key, filter as string);
    } else {
      params.append(key, "");
    }
  });

  return params.toString();
};

/**
 * Replace URL with given parameters
 */
export const replaceUrl = (filters: any) => {
  const queryString = createQueryString(filters);
  const urlWithQuery = `${window.location.origin}${window.location.pathname}?${queryString}`;
  history.replaceState(null, "", urlWithQuery);
};

// /**
//  * Update URL with given key and value
//  */
// export const updateUrlParams = (key: string, value: string): void => {
//   const params = new URLSearchParams(window.location.search);
//   if (value !== undefined && value !== null) {
//     params.set(key, value);
//   } else {
//     params.delete(key);
//   }
//   window.history.pushState(
//     {},
//     "",
//     `${window.location.pathname}?${params.toString()}`
//   );
// };

// /**
//  * Get specific value from URL with given key
//  */
// export const getUrlParams = (key: string): string => {
//   const params = new URLSearchParams(window.location.search);

//   return params.get(key) || "";
// };
