import R from 'ramda';

let TransactionState = function (transactionOptions) {
  this.options = transactionOptions;
  this.transactionMap = {};
};

TransactionState.prototype.get = function (path, method) {
  if (!path || !method) { return ''; }

  return this.transactionMap[path + method] || '';
};

TransactionState.prototype.isStateful = function (path, method) {
  let isDefined = Boolean(this.options[path]);
  let methodsMatch = isDefined && Boolean(this.options[path].method === method);
  return isDefined && methodsMatch;
};

TransactionState.prototype.set = function (statefulPath, method, transactionKey) {
  // TODO: Investigate why we are providing a method argument above.
  let pathOptions = R.prop(statefulPath, this.options);
  if (!pathOptions) { return; }

  this.transactionMap = pathOptions.links.reduce((targetObj, { path, method }) =>
    R.assoc(path + method, transactionKey, targetObj)
  , {});
};

export default TransactionState;
