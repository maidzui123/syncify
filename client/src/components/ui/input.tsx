import * as React from "react"
import {cn} from "@/lib/utils"

type inputProps = {
    renderRightIcon?: () => JSX.Element
} & React.ComponentProps<"input">

const Input = React.forwardRef<HTMLInputElement, inputProps>(
    ({className, type, renderRightIcon, ...props}, ref) => {
        return (
            <div className='flex h-9 w-full'>
                <input
                    type={type}
                    className={cn(
                        "w-full h-full border rounded-l-md border-blue-300 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        className,
                        renderRightIcon ? "rounded-r-none" : "rounded-r-md",
                    )}
                    ref={ref}
                    {...props}
                />
                {renderRightIcon && <div className='flex items-center justify-center h-full w-9 rounded-r-md'>
                    {renderRightIcon()}
                </div>}
            </div>
        )
    }
)
Input.displayName = "Input"

export {Input}
