const filterQueryParameters = (blacklist, path) => {
  if (!blacklist) return path;

  const queryStringIndex = path.indexOf('?');
  if (queryStringIndex === -1) return path;

  const blacklistArray = blacklist.split(',');
  const host = path.substr(0, queryStringIndex);
  const queryString = path.substr(queryStringIndex + 1);

  const queryStringObj = qs.parse(queryString);
  const filteredQueryStringObj = R.omit(blacklistArray);
  const filteredQueryString = qs.stringify(filteredQueryStringObj);

  if (filteredQueryString === '') return host;
  return `${host}?${filteredQueryString}`;
};

export {filterQueryParameters};
