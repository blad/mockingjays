import qs from 'querystring';
import R from 'ramda';

const filterQueryParameters = (blacklist, path) => {
  if (!blacklist) return path;

  const queryStringIndex = path.indexOf('?');
  if (queryStringIndex === -1) return path;

  const blacklistArray = R.pipe(
    R.split(','),
    R.map(R.trim)
  )(blacklist);

  const host = path.substr(0, queryStringIndex);
  const queryString = path.substr(queryStringIndex + 1);

  const filteredQueryString = R.pipe(
    qs.parse,
    R.omit(blacklistArray),
    qs.stringify,
  )(queryString);

  if (filteredQueryString === '') return host;
  return `${host}?${filteredQueryString}`;
};

export default { filterQueryParameters };
