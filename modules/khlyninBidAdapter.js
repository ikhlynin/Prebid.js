import { registerBidder } from '../src/adapters/bidderFactory.js';
import { BANNER } from '../src/mediaTypes.js';

const BIDDER_CODE = 'khlyninAdapter';
const ENDPOINT_URL = 'https://prebid.khlynin.com/auction';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid(bid) {
    return !!bid.params.placementId;
  },

  buildRequests(validBidRequests, bidderRequest) {
    return validBidRequests.map(bid => {
      const payload = {
        placementId: bid.params.placementId,
        bidId: bid.bidId,
        sizes: bid.mediaTypes?.banner?.sizes,
        referer: bidderRequest.refererInfo.page,
      };

      return {
        method: 'POST',
        url: ENDPOINT_URL,
        data: JSON.stringify(payload),
      };
    });
  },

  interpretResponse(serverResponse) {
    const responseBody = serverResponse.body;
    if (!responseBody || !responseBody.bids) {
      return [];
    }

    return responseBody.bids.map(bid => ({
      requestId: bid.bidId,
      cpm: bid.cpm,
      width: bid.width,
      height: bid.height,
      ad: bid.ad,
      creativeId: bid.creativeId || bid.bidId,
      currency: bid.currency || 'USD',
      ttl: bid.ttl || 300,
      netRevenue: true,
      mediaType: BANNER
    }));
  }
};

registerBidder(spec);
