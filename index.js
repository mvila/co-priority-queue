"use strict";

// Most of the code comes from co-queue created by Julian Gruber
// https://github.com/segmentio/co-queue

var Queue = function() {
  this.jobs = [];
  this.fns = [];
};

Queue.prototype.push = function(data, priority) {
  if (this.fns.length)
    return this.fns.shift()(null, data);
  var job = { data: data, priority: priority };
  var index = sortedIndex(this.jobs, job, function(job) {
    return job.priority;
  });
  this.jobs.splice(index, 0, job);
};

Queue.prototype.next = function() {
  var that = this;
  return function(fn) {
    if (that.jobs.length)
      return fn(null, that.jobs.pop().data);
    that.fns.push(fn);
  };
};

var sortedIndex = function(array, value, transformer) {
  // Copied from https://github.com/lodash/lodash
  value = transformer(value);
  var low = 0;
  var high = array ? array.length : low;
  while (low < high) {
    var mid = (low + high) >>> 1;
    (transformer(array[mid]) < value)
      ? (low = mid + 1)
      : (high = mid);
  }
  return low;
}

module.exports = Queue;
