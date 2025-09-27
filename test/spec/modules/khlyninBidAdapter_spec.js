import { expect } from 'chai';
import { spec } from 'modules/khlyninBidAdapter.js';

const ENDPOINT_URL = 'https://prebid.khlynin.com/auction'

const TEST_BID = {
  bidder: 'khlynin',
  bidId: 'test-id',
  adUnitCode: 'ad-unit-code',
  mediaTypes: { banner: { sizes: [[300, 250]] } },
  params: { placementId: 'test-placement' }
};

const TEST_REQUEST = {
  refererInfo: { page: 'https://example.com/test-page' }
};

describe('KhlyninBidAdapter', function () {
  describe('isBidRequestValid', function () {
    it('return true if bid valid', function () {
      expect(spec.isBidRequestValid(TEST_BID)).to.be.true;
    });

    it('return false if placementId is undefined', function () {
      const invalidBid = { ...TEST_BID, params: {} };
      expect(spec.isBidRequestValid(invalidBid)).to.be.false;
    });
  });

  describe('buildRequests', function () {
    it('return POST for valid data', function () {
      const requests = spec.buildRequests([TEST_BID], TEST_REQUEST);
      expect(requests).to.be.an('array').with.lengthOf(1);

      const request = requests[0];
      expect(request.method).to.equal('POST');
      expect(request.url).to.equal(ENDPOINT_URL);

      const data = JSON.parse(request.data);
      expect(data).to.include({
        placementId: 'test-placement',
        bidId: 'test-id',
        referer: 'https://example.com/test-page'
      });
      expect(data.sizes).to.deep.equal([[300, 250]]);
    });
  });

  describe('interpretResponse', function () {
    it('return array of bids if response valid', function () {
      const serverResponse = {
        body: {
          bids: [
            {
              bidId: 'test-id',
              cpm: 1.23,
              width: 300,
              height: 250,
              ad: '<div>Test</div>',
              creativeId: 'creative123',
              currency: 'USD',
              ttl: 300
            }
          ]
        }
      };

      const result = spec.interpretResponse(serverResponse, {});
      expect(result).to.be.an('array').with.lengthOf(1);
      const bid = result[0];

      expect(bid.requestId).to.equal('test-id');
      expect(bid.cpm).to.equal(1.23);
      expect(bid.width).to.equal(300);
      expect(bid.height).to.equal(250);
      expect(bid.ad).to.equal('<div>Test</div>');
      expect(bid.creativeId).to.equal('creative123');
    });

    it('return empty array if body.bids', function () {
      const emptyResponse = { body: {} };
      const result = spec.interpretResponse(emptyResponse, {});
      expect(result).to.deep.equal([]);
    });
  });
});
