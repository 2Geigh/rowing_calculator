const handleMouseUp_CIRCLE = (event) => {
    isMouseDown.current = false;
    setCursorStyle("row-resize");
    isMouseDraggingPointOnPlot.current = false;
    pointThatsBeingDraggedByTheUser.current = null;
};

export default handleMouseUp_CIRCLE;