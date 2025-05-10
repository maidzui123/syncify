import {CircleX} from 'lucide-react'

type previewMediaProps = {
    media: string;
    height: number;
    type: string;
    isEditable?: boolean;
    handleRemove: () => void;
}

const PreviewMedia = (props: previewMediaProps) => {

    const { media, type, height, isEditable, handleRemove } = props;

    return <div className='relative flex-none rounded-xl overflow-hidden select-none' style={{ height: `${height}px` }}>
        {type === 'image' ? <img draggable={false} className='h-full select-none' src={media} alt=''/> :
            <video draggable={false} className='h-full select-none' src={media}/>}
        {isEditable && <CircleX className='absolute top-[12px] right-[12px]' height={28} width={28} color='#c31818' onClick={handleRemove}/>}
    </div>
}

export default PreviewMedia