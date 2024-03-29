const Address = require('../db/Address');
const NFTS = require('../db/Nfts');
const { Moralis } = require('../libs/moralis');
const { syncNFTs } = require('../services/nfts');

const watchAddress = async (address, reindex) => {
  for (const chain of ['Eth', 'Bsc', 'Polygon']) {
    Moralis.Cloud.run(`watch${chain}Address`, {
      address
    });
  }

  try {
    const collection = new Address();

    if (reindex) {
      const nftsCollection = new NFTS();
      await Promise.all([
        collection.deleteOne({ address }),
        nftsCollection.deleteMany({ address })
      ]);
    } else {
      const item = await collection.findOne({ address });

      if (item) {
        return item;
      }
    }
    const data = {
      address,
      sync_status: 'new',
      sync_progress: 0,
      last_error: null
    };
    await collection.insertOne(data);
    return data;
  } catch (err) {
    console.error('Address Status get Error:', err);
  }
};

const controller = {
  getNFTs: async (req, res) => {
    const { offset, address, token_address, chain, term, orderBy, direction } = req.query;
    const collection = new NFTS();
    const query = {};

    address && (query.owner_of = address.toLowerCase());
    token_address && (query.token_address = token_address);

    if (chain) {
      query.chain = {
        $in: chain
      };
    }

    if (term) {
      query.$text = {
        $search: term
      };
    }

    const items = await collection.instance
      .find(query)
      .sort({ 'metadata.name': +direction || 1, name: +direction || 1, _id: 1 })
      .skip(+offset || 0)
      .limit(12)
      .toArray();

    return res.json(items);
  },
  indexNFTs: async (req, res) => {
    const { address, reindex } = req.body;

    console.log('indexCollections: ', address);

    const status = await watchAddress(address, reindex);

    await syncNFTs(address, status);
    // await
    return res.json({ success: true, message: 'Successfully indexed' });
  }
};

module.exports = controller;
