export const playTrack = (player, track) => {
  if (player.currentTrack?.id === track.id) {
    player.togglePlayPause();
  } else {
    player.setCurrentTrack(track);
    player.play();
} };