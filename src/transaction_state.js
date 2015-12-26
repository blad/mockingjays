var TransactionState = function (transactionOptions) {
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
  var isDefined = Boolean(this.options[path]);
  var methodsMatch = isDefined && Boolean(this.options[path].method === method);
  return isDefined && methodsMatch;
}

TransactionState.prototype.set = function (statefulPath, method, transactionKey) {
  var self = this;
  if(!this.options[statefulPath]) {
    return;
  } else {
    var affectedPaths = this.options[statefulPath].links;
    affectedPaths.forEach(function (pathOptions) {
      self.transactionMap[pathOptions.path + pathOptions.method] = transactionKey;
    });
  }
}

module.exports = TransactionState
