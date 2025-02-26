import { useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import "./PortalPopup.css";

const PortalPopup = ({
  children,
  overlayColor,
  placement = "Centered",
  onOutsideClick,
  zIndex = 100,
}) => {
  const popupStyle = useMemo(() => {
    const style = {};
    style.zIndex = zIndex;

    if (overlayColor) {
      style.backgroundColor = overlayColor;
    }

    switch (placement) {
      case "Centered":
        style.alignItems = "center";
        style.justifyContent = "center";
        break;
      case "Top left":
        style.alignItems = "flex-start";
        break;
      case "Top center":
        style.alignItems = "center";
        break;
      case "Top right":
        style.alignItems = "flex-end";
        break;
      case "Bottom left":
        style.alignItems = "flex-start";
        style.justifyContent = "flex-end";
        break;
      case "Bottom center":
        style.alignItems = "center";
        style.justifyContent = "flex-end";
        break;
      case "Bottom right":
        style.alignItems = "flex-end";
        style.justifyContent = "flex-end";
        break;
      default:
    }

    return style;
  }, [placement, overlayColor, zIndex]);

  const onOverlayClick = useCallback(
    e => {
      if (onOutsideClick && e.target.classList.contains("portalPopupOverlay")) {
        onOutsideClick();
      }
      e.stopPropagation();
    },
    [onOutsideClick]
  );

  return (
    <Portal>
      <div
        className={"portalPopupOverlay"}
        style={popupStyle}
        onClick={onOverlayClick}>
        {children}
      </div>
    </Portal>
  );
};

export const Portal = ({ children, containerId = "portals" }) => {
  let portalsDiv = document.getElementById(containerId);
  if (!portalsDiv) {
    portalsDiv = document.createElement("div");
    portalsDiv.setAttribute("id", containerId);
    document.body.appendChild(portalsDiv);
  }

  return createPortal(children, portalsDiv);
};
export default PortalPopup;
