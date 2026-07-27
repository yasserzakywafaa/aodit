import "react-toastify/dist/ReactToastify.css";
import "./Notification.scss";

import {
  ToastContainer,
  ToastContainerProps,
  ToastOptions,
  TypeOptions,
  toast,
} from "react-toastify";

interface NotificationProps extends ToastContainerProps {}

interface NotificationToast {
  content: string | React.ReactNode;
  type?: TypeOptions;
  options?: ToastOptions;
}

export enum ToastTypes {
  Info = "info",
  Error = "error",
  Success = "success",
  Warning = "warning",
  Default = "default",
}

export const Notification = (props: NotificationProps) => {
  return (
    <ToastContainer
      rtl={props.rtl}
      role={props.role}
      icon={props.icon}
      limit={props.limit}
      style={props.style}
      onClick={props.onClick}
      stacked={props.stacked}
      className={props.className}
      bodyStyle={props.bodyStyle}
      draggable={props.draggable}
      theme={props.theme || "dark"}
      toastStyle={props.toastStyle}
      newestOnTop={props.newestOnTop}
      closeButton={props.closeButton}
      containerId={props.containerId}
      closeOnClick={props.closeOnClick}
      autoClose={props.autoClose || 1500}
      bodyClassName={props.bodyClassName}
      progressStyle={props.progressStyle}
      toastClassName={props.toastClassName}
      hideProgressBar={props.hideProgressBar}
      position={props.position || "top-right"}
      pauseOnHover={props.pauseOnHover || true}
      pauseOnFocusLoss={props.pauseOnFocusLoss}
      draggablePercent={props.draggablePercent}
      progressClassName={props.progressClassName}
      draggableDirection={props.draggableDirection}
      // enableMultiContainer={props.enableMultiContainer}
    />
  );
};

export const Notify = (props: NotificationToast) => {
  const renderContent = (): React.ReactNode => {
    return (
      <span dangerouslySetInnerHTML={{ __html: props.content as string }} />
    );
  };

  switch (props.type) {
    case ToastTypes.Info:
      return toast.info(renderContent(), props.options);
    case ToastTypes.Error:
      return toast.error(renderContent(), props.options);
    case ToastTypes.Success:
      return toast.success(renderContent(), props.options);
    case ToastTypes.Warning:
      return toast.warning(renderContent(), props.options);
    default:
      return toast(renderContent(), props.options);
  }
};
