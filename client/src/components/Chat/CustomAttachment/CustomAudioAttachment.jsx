/* eslint-disable react/prop-types */
import AudioFile from './AudioComponent'

const CustomAudioAttachment = ({ og, ...props }) => {
  // you can add any custom data (such as "customType" in this case)
  if (og.asset_url && og?.type === 'audio')
    return <AudioFile url={og?.asset_url} />
}

export default CustomAudioAttachment
