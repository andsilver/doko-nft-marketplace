import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Typography
} from '@material-ui/core';

import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import activeShare from './assets/active-share.png';
import inactiveShare from './assets/inactive-share.png';
import facebook from './assets/facebook.png';
import twitter from './assets/twitter.png';
import NoImage from './assets/NoImage.png';
import loading from './assets/loading.gif';
import Popover from '../../components/Popover';
interface NFTItemProps {
  nft: any;
}

export const NFTItem = ({ nft }: NFTItemProps) => {
  if (nft.metadata && !nft.metadata.image && nft.metadata.image_data) {
    nft.metadata.image = nft.metadata.image_data;
  }

  if (nft.metadata?.image?.indexOf('ipfs') === 0) {
    nft.metadata.image = `https://ipfs.io/${nft.metadata.image
      .replace('ipfs/', '')
      .replace('ipfs://', 'ipfs/')}`;
  }
  const styles = useStyles();
  const [shareActive, setShareActive] = useState(false);
  const share = (type: 'facebook' | 'twitter') => {
    const url = `${window.origin}/collections/${nft.owner_of}`;
    const link = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out my multi-chain NFT collection on DOKO at now!`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out my multi-chain NFT collection on @doko_nft now!`,
      instagram: ''
    };
    window.open(link[type], '_blank');
  };
  const [error, setError] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <Grid container alignItems="center" style={{ flex: 1 }}>
            {nft.metadata.image && !error ? (
              nft.metadata.image.indexOf('<svg') === 0 ? (
                <div
                  style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: nft.metadata.image }}
                  className={styles.image}
                />
              ) : (
                <LazyLoadImage
                  className={styles.image}
                  alt=""
                  width="100%"
                  src={nft.metadata.image}
                  placeholder={<img src={loading} alt="" />}
                  effect="opacity"
                  onError={() => setError(true)}
                />
              )
            ) : (
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ flex: 1 }}
                className={styles.image}
                direction="column"
              >
                <img width={60} src={NoImage} style={{ marginBottom: 24 }} alt="Not Available" />
                {error ? (
                  <div>
                    <Typography className={styles.notAvailableText} gutterBottom variant="h5">
                      Sorry!
                    </Typography>
                    <Typography className={styles.notAvailableText}>Image unavailable</Typography>
                    <Typography className={styles.notAvailableText}>due to host error</Typography>
                  </div>
                ) : (
                  <Typography className={styles.notAvailableText}>
                    The NFT doesn't have image
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
          <Typography className={styles.nftName} variant="caption">
            {nft.metadata?.name || nft.name || '-'}
          </Typography>
        </CardContent>
        <CardActions className={styles.cardActions}>
          <img
            className={styles.networkIcon}
            width="12px"
            src={{ eth, bsc, polygon }[nft.chain as string]}
            alt={nft.chain}
          />
          <Popover
            reference={
              <IconButton
                onMouseEnter={() => setShareActive(true)}
                onMouseLeave={() => setShareActive(false)}
              >
                {shareActive ? (
                  <img className={styles.shareIcon} src={activeShare} alt="share" />
                ) : (
                  <img className={styles.shareIcon} src={inactiveShare} alt="share" />
                )}
              </IconButton>
            }
            placement="bottom-end"
          >
            <MenuList>
              <MenuItem className={styles.shareItem} onClick={() => share('facebook')}>
                <img src={facebook} alt="facebook" />
                Share on Facebook
              </MenuItem>
              <MenuItem className={styles.shareItem} onClick={() => share('twitter')}>
                <img src={twitter} alt="twitter" />
                Share on Twitter
              </MenuItem>
            </MenuList>
          </Popover>
        </CardActions>
      </Card>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100%',
    borderRadius: 12,
    backgroundClip: 'padding-box',
    border: 'solid 3px transparent',
    position: 'relative',
    '&:hover': {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background:
          'linear-gradient(-45deg, rgba(63,199,203,1) 0%, rgba(63,199,203,1) 30%, rgba(80,92,176,1) 50%, rgba(148,64,161,1) 80%, rgba(226,69,162,1) 100%)',
        borderRadius: 'inherit',
        margin: -3,
        zIndex: -1
      }
    }
  },
  card: {
    height: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  cardContent: {
    padding: 6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200
  },
  cardActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  nftName: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'black'
  },
  image: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: 400,
    minHeight: 200,
    '& > svg': {
      width: '100%',
      height: 'auto'
    }
  },
  networkIcon: {
    width: 10,
    marginLeft: 8,
    marginBottom: 8
  },
  shareIcon: {
    width: 20
  },
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white'
    },
    '& > img': {
      width: 24,
      marginRight: 12
    }
  },
  notAvailableText: {
    color: '#b3b3b3',
    textAlign: 'center'
  }
}));
