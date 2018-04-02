let TransactionState = function (transactionOptions) {
  this.options = transactionOptions;
  this.transactionMap = {};
}

TransactionState.prototype.get = function (path, method) {
  if (!path || !method) {
    return '';
  } else {
    return this.transactionMap[path + method] || '';
  }
}

TransactionState.prototype.isStateful = function(path, method) {
  let isDefined = Boolean(this.options[path]);
  let methodsMatch = isDefined && Boolean(this.options[path].method === method);
  return isDefined && methodsMatch;
}

TransactionState.prototype.set = function (statefulPath, method, transactionKey) {
  if(!this.options[statefulPath]) {
    return;
  } else {
    let affectedPaths = this.options[statefulPath].links;
    affectedPaths.forEach(pathOptions => {
      this.transactionMap[pathOptions.path + pathOptions.method] = transactionKey;
    });
  }
}

export default TransactionState;
