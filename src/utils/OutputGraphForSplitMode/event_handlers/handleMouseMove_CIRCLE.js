const handleMouseMove_CIRCLE = (event) => {
    pointThatsBeingDraggedByTheUser.current = event.target.id.slice(-1);
    pointThatsBeingDraggedByTheUser.y = BarAndCircleHeights[pointThatsBeingDraggedByTheUser.current];
};

export default handleMouseMove_CIRCLE;