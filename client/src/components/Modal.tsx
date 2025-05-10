import React, {CSSProperties} from 'react';

type modalProps = {
    open: boolean,
    onClose: () => void,
    children: React.ReactNode,
    width?: number,
    height?: number,
    showHeader?: boolean,
    showBottom?: boolean,
    title?: string,
    style?: CSSProperties;
    renderBottom?: () => JSX.Element;
}

const Modal = (props: modalProps) => {

    const { open, onClose, children, width, height, showHeader = true, title, showBottom = true, style, renderBottom } = props;

    return <div className='fixed inset-0 z-[896] items-center justify-center' style={{ display: open ? "flex": 'none' }}>
        <div className='absolute inset-0 z-[897] bg-black opacity-60' onClick={() => onClose()}/>
        <div className='absolute z-[898] flex flex-col bg-white shadow-white rounded-xl' style={{ width: `${width}px`, height: `${height}px`, ...style  }}>
            {showHeader && <div className='h-16 relative flex justify-center items-center px-6 border-b-[1px]'>
                {title && <h2 className='justify-self-center font-bold text-xl'>{title}</h2>}
                <div className='h-6 w-6 flex justify-center items-center absolute right-3 cursor-pointer' onClick={() => onClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-circle-x">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m15 9-6 6"/>
                        <path d="m9 9 6 6"/>
                    </svg>
                </div>
            </div>}
            <div className='px-4 py-4 flex flex-1 flex-col items-center overflow-y-auto'>
                {children}
            </div>
            {showBottom && <div className='h-16 px-4 flex justify-end items-center border-t-[1px]'>
                {renderBottom && renderBottom()}
            </div>}
        </div>
    </div>
}

export default Modal;