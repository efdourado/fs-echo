const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() || '0';
};

export const normalizeDataForPage = (type, data) => {
  if (!data) return null;

  switch (type) {
    case 'artist':
      return {
        pageType: 'Artist',
        title: data.name,
        description: data.description,
        
        primaryImage: data.image,
        backgroundImage: data.banner || data.image,
        
        mainContent: {
          title: 'Popular Songs',
          type: 'songs',
          items: data.topSongs || [],
        },
        subContent: {
          title: 'Albums',
          type: 'albums',
          items: data.albums || [],
        },

        stats: [
          { label: 'Followers', value: formatNumber(data.followers) },
          { label: 'Monthly Listeners', value: formatNumber(data.monthlyListeners) },
        ],
        isVerified: data.verified,
      };

    case 'album':
      return {
        pageType: data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Album',
        title: data.title,
        description: `Album by ${data.artist?.name || 'Unknown Artist'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Songs',
          type: 'songs',
          items: data.songs || [],
        },

        subContent: null,

        stats: [
          { label: 'Released', value: new Date(data.releaseDate).getFullYear() },
          { label: 'Songs', value: data.songs?.length || 0 },
        ],
        isVerified: data.artist?.verified,
      };

    case 'playlist':
      return {
        pageType: 'Playlist',
        title: data.name,
        description: data.description || `A playlist by ${data.owner?.username || 'Unknown'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Songs',
          type: 'songs',

          items: data.songs ? data.songs.map(item => item.song).filter(Boolean) : [],
        },
        subContent: null,

        stats: [
          { value: 'Created by', label: data.owner?.username || 'Anonymous' },
          { label: 'Songs', value: data.songs?.length || 0 },
        ],
        isVerified: false,
      };
      
    case 'song':
      return {
        pageType: 'Song',
        title: data.title,
        description: `From the album ${data.album?.title || 'Single'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage || data.artist?.image,
        mainContent: {
          title: 'Lyrics',
          type: 'lyrics',
          items: data.lyrics,
        },
        subContent: null,
        stats: [
          { label: 'Plays', value: formatNumber(data.plays) },
          { label: 'Released', value: new Date(data.releaseDate).getFullYear() },
        ],
        isVerified: data.artist?.verified,
      };

    default:
      return null;
} };