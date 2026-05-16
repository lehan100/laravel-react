import TinyMCEController from './TinyMCEController'
import MediaPositionController from './MediaPositionController'
import MediaBannerController from './MediaBannerController'

const Media = {
    TinyMCEController: Object.assign(TinyMCEController, TinyMCEController),
    MediaPositionController: Object.assign(MediaPositionController, MediaPositionController),
    MediaBannerController: Object.assign(MediaBannerController, MediaBannerController),
}

export default Media