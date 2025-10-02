export const isMobile= ({setIsOpen}:any)=>{
    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };
    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize);
    };
}