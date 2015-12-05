'use strict';

describe('Service: ptTracking', function () {

  // load the service's module
  beforeEach(module('ptTrackingApp'));

  // instantiate service
  var ptTracking;
  beforeEach(inject(function (_ptTracking_) {
    ptTracking = _ptTracking_;
  }));

  it('should do something', function () {
    expect(!!ptTracking).toBe(true);
  });

});
