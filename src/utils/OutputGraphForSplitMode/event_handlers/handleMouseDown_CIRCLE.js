const handleMouseDown_CIRCLE = (event) => {
    isMouseDown.current = true;
    setCursorStyle("grab");
    isMouseDraggingPointOnPlot.current = true;
};

export default handleMouseDown_CIRCLE;