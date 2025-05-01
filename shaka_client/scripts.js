let player; // Declare player globally

async function init() {
  const video = document.getElementById('video');
  const ui = video['ui'];
  const controls = ui.getControls();
  player = controls.getPlayer();

  window.player = player;
  window.ui = ui;

  player.addEventListener('error', onPlayerErrorEvent);
  controls.addEventListener('error', onUIErrorEvent);

  // Optionally load a default manifest on startup
  const defaultManifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
  try {
    await player.load(defaultManifestUri);
    console.log('The default video has been loaded!');
  } catch (error) {
    onPlayerError(error);
  }

  // Set up the button to load a manifest from user input
  const loadButton = document.getElementById('load-button');
  loadButton.addEventListener('click', loadManifestFromInput);
}

async function loadManifestFromInput() {
  const manifestInput = document.getElementById('manifest-url');
  const manifestUri = manifestInput.value.trim();
  if (!manifestUri) {
    console.error('No manifest URL entered.');
    return;
  }

  try {
    await player.load(manifestUri);
    console.log('Manifest loaded successfully:', manifestUri);
  } catch (error) {
    onPlayerError(error);
  }
}

function onPlayerErrorEvent(errorEvent) {
  onPlayerError(errorEvent.detail);
}

function onPlayerError(error) {
  console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(errorEvent) {
  onPlayerError(errorEvent.detail);
}

function initFailed(errorEvent) {
  console.error('Unable to load the Shaka UI library!');
}

// Listen to Shaka Player custom events
document.addEventListener('shaka-ui-loaded', init);
document.addEventListener('shaka-ui-load-failed', initFailed);
