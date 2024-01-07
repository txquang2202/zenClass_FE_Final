import React,{useState} from "react";

const Tooltip = ({text,children}) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div 
            className="relative inline-block "
            onMouseEnter={()=>setIsVisible(true)}
            onMouseLeave={()=>setIsVisible(false)}
        >
            <div>{children}</div>
            {isVisible && 
                <div className="w-[250px] absolute left-[150%] bottom-[90%]  border-solid border-[0.1rem] border-black bg-white rounded-md">
                    <div className="p-[5px]">{text}</div>
                </div>
            }
        </div>
    )
};

export default Tooltip;