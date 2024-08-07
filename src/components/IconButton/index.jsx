import Copy from './copy.jsx'
import Share from './share.jsx'
import Like from './like.jsx'
import './index.scss'

const IconButton = ({
    selected,
    disabled,
    type,
    clickFn,
    hoverType
}) => {
    return <div
        className='icon-button thirty-two-round'
        data-selected={selected}
        disabled={disabled}
        data-type={type}
        data-hover-type={hoverType}
        onClick={() => {
            if(disabled){
                //
            } else {
                clickFn()
            }
        }}
    >
        {type === 'copy' ? <Copy></Copy> : null}
        {type === 'share' ? <Share></Share> : null}
        {type === 'like' ? <Like></Like> : null}
    </div>
}

export default IconButton