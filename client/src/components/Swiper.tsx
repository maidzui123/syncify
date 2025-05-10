import PreviewMedia from "./PreviewMedia.tsx";
import {MouseEvent, useRef, useState} from 'react'
import {mediaDef} from "@/constants/types/post.ts";

type swiperProps = {
    mediaList: mediaDef[];
    isEditable?: boolean;
    onRemove?: (index: number) => void;
}

const Swiper = (props: swiperProps) => {

    const { mediaList, isEditable, onRemove } = props

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);

    const swiperRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const container = swiperRef.current!;
        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const container = swiperRef.current!;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = (index: number) => {
        if (onRemove) onRemove(index);
    };

    return <div
        className='w-full h-fit flex gap-3 flex-nowrap cursor-grab overflow-hidden overscroll-none py-2 no-scrollbar active:cursor-grabbing'
        style={isEditable ? undefined : { cursor: 'pointer' }}
        ref={swiperRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}>
        {mediaList.map((item, index) => {
            return <PreviewMedia key={index} media={item.url} height={240} type={item.type} isEditable={isEditable}
                                 handleRemove={() => handleRemove(index)}/>
        })}
    </div>
}

export default Swiper;